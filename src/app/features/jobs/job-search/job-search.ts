import {
  Component, inject, OnInit, OnDestroy, NgZone, DestroyRef,
  signal, computed, ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { JobService } from '../../../core/services/job.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { Job, JobSearchFilters } from '../../../core/models/job.model';
import { Application } from '../../../core/models/application.model';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { selectAllFavorites } from '../../../store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { JobCard } from '../job-card/job-card';
import { JobFilters } from '../job-filters/job-filters';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideSearch } from '@ng-icons/lucide';

@Component({
  selector: 'app-job-search',
  standalone: true,
  imports: [JobCard, JobFilters, LoadingSpinner, NgIcon],
  viewProviders: [provideIcons({ lucideSearch })],
  templateUrl: './job-search.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobSearch implements OnInit, OnDestroy {
  private readonly jobService = inject(JobService);
  private readonly auth = inject(AuthService);
  private readonly appService = inject(ApplicationsService);
  private readonly store = inject(Store);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);
  private readonly scrollHandler = this.onScroll.bind(this);
  private readonly BATCH_SIZE = 20;

  private readonly allJobs = signal<Job[]>([]);
  private readonly currentPage = signal(1);
  private readonly hasMoreFromApi = signal(true);
  private readonly favoritesMap = signal(new Map<string, FavoriteOffer>());

  readonly displayedJobs = signal<Job[]>([]);
  readonly loading = signal(false);
  readonly loadingMore = signal(false);
  readonly error = signal('');
  readonly trackedOfferIds = signal(new Set<string>());

  readonly isAuthenticated = this.auth.isAuthenticated;
  readonly currentUser = this.auth.currentUser;

  readonly canLoadMore = computed(() =>
    this.displayedJobs().length < this.allJobs().length || this.hasMoreFromApi()
  );

  private currentFilters: JobSearchFilters = { keyword: '', location: '' };

  ngOnInit(): void {
    this.searchJobs({ keyword: '', location: '' });

    if (this.isAuthenticated()) {
      const userId = this.currentUser()?.id;
      if (userId) {
        this.store.dispatch(FavoritesActions.loadFavorites({ userId }));
        this.loadTrackedApplications(userId);
      }
    }

    this.store.select(selectAllFavorites).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(favs => {
      const map = new Map<string, FavoriteOffer>();
      favs.forEach(f => map.set(f.offerId, f));
      this.favoritesMap.set(map);
    });

    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.scrollHandler, { passive: true });
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  searchJobs(filters: JobSearchFilters): void {
    this.currentFilters = filters;
    this.currentPage.set(1);
    this.loading.set(true);
    this.error.set('');
    this.allJobs.set([]);
    this.displayedJobs.set([]);
    this.hasMoreFromApi.set(true);

    this.jobService.searchJobs({ ...filters, page: 1 }).subscribe({
      next: response => {
        const data = response.data ?? [];
        this.allJobs.set(data);
        this.hasMoreFromApi.set(!!response.links?.next);
        this.displayedJobs.set(data.slice(0, this.BATCH_SIZE));
        this.loading.set(false);
      },
      error: (err: Error) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  loadMore(): void {
    if (this.loading() || this.loadingMore()) return;

    const displayed = this.displayedJobs();
    const all = this.allJobs();

    if (displayed.length < all.length) {
      this.displayedJobs.set(all.slice(0, displayed.length + this.BATCH_SIZE));
      return;
    }

    if (!this.hasMoreFromApi()) return;

    this.loadingMore.set(true);
    const nextPage = this.currentPage() + 1;
    this.currentPage.set(nextPage);

    this.jobService.searchJobs({ ...this.currentFilters, page: nextPage }).subscribe({
      next: response => {
        const newAll = [...this.allJobs(), ...(response.data ?? [])];
        this.allJobs.set(newAll);
        this.hasMoreFromApi.set(!!response.links?.next);
        this.displayedJobs.set(newAll.slice(0, this.displayedJobs().length + this.BATCH_SIZE));
        this.loadingMore.set(false);
      },
      error: () => {
        this.loadingMore.set(false);
      },
    });
  }

  isFavorite(slug: string): boolean {
    return this.favoritesMap().has(slug);
  }

  isTracked(slug: string): boolean {
    return this.trackedOfferIds().has(slug);
  }

  addToFavorites(job: Job): void {
    const user = this.currentUser();
    if (!user?.id) return;

    const favorite: FavoriteOffer = {
      userId: user.id,
      offerId: job.slug,
      title: job.title,
      company: job.company_name,
      location: job.location,
      url: job.url,
    };
    this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
  }

  removeFromFavorites(job: Job): void {
    const fav = this.favoritesMap().get(job.slug);
    if (fav?.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id }));
    }
  }

  trackApplication(job: Job): void {
    const user = this.currentUser();
    if (!user?.id) return;

    const application: Application = {
      userId: user.id,
      offerId: job.slug,
      apiSource: 'arbeitnow',
      title: job.title,
      company: job.company_name,
      location: job.location,
      url: job.url,
      status: 'pending',
      notes: '',
      dateAdded: new Date().toISOString(),
    };

    this.appService.add(application).subscribe({
      next: () => {
        this.trackedOfferIds.update(ids => {
          const next = new Set(ids);
          next.add(job.slug);
          return next;
        });
      },
      error: (err: Error) => console.error('Failed to track application:', err.message),
    });
  }

  private onScroll(): void {
    if (this.loading() || this.loadingMore() || !this.canLoadMore()) return;

    const threshold = 300;
    const position = window.innerHeight + window.scrollY;
    const height = document.documentElement.scrollHeight;

    if (height - position < threshold) {
      this.ngZone.run(() => this.loadMore());
    }
  }

  private loadTrackedApplications(userId: number): void {
    this.appService.getByUser(userId).subscribe({
      next: apps => {
        this.trackedOfferIds.set(new Set(apps.map(a => a.offerId)));
      },
    });
  }
}
