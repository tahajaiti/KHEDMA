import { Component, inject, OnInit, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationsService } from '../../../core/services/applications.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { ApplicationCard } from '../application-card/application-card';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClipboardList } from '@ng-icons/lucide';

@Component({
  selector: 'app-applications-page',
  standalone: true,
  imports: [ApplicationCard, LoadingSpinner, NgIcon],
  viewProviders: [provideIcons({ lucideClipboardList })],
  templateUrl: './applications-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationsPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly appService = inject(ApplicationsService);

  readonly applications = signal<Application[]>([]);
  readonly loading = signal(true);
  readonly activeFilter = signal<ApplicationStatus | 'all'>('all');

  readonly filteredApplications = computed(() => {
    const filter = this.activeFilter();
    const apps = this.applications();
    return filter === 'all' ? apps : apps.filter(a => a.status === filter);
  });

  readonly counts = computed(() => {
    const apps = this.applications();
    return {
      all: apps.length,
      pending: apps.filter(a => a.status === 'pending').length,
      accepted: apps.filter(a => a.status === 'accepted').length,
      rejected: apps.filter(a => a.status === 'rejected').length,
    };
  });

  ngOnInit(): void {
    this.loadApplications();
  }

  setFilter(filter: ApplicationStatus | 'all'): void {
    this.activeFilter.set(filter);
  }

  onStatusChange(event: { id: number; status: ApplicationStatus }): void {
    this.appService.updateStatus(event.id, event.status).subscribe({
      next: updated => {
        this.applications.update(apps =>
          apps.map(a => a.id === event.id ? { ...a, status: updated.status } : a)
        );
      },
    });
  }

  onNotesChange(event: { id: number; notes: string }): void {
    this.appService.updateNotes(event.id, event.notes).subscribe({
      next: updated => {
        this.applications.update(apps =>
          apps.map(a => a.id === event.id ? { ...a, notes: updated.notes } : a)
        );
      },
    });
  }

  onRemove(id: number): void {
    this.appService.remove(id).subscribe({
      next: () => {
        this.applications.update(apps => apps.filter(a => a.id !== id));
      },
    });
  }

  private loadApplications(): void {
    const userId = this.auth.currentUser()?.id;
    if (!userId) return;

    this.appService.getByUser(userId).subscribe({
      next: apps => {
        this.applications.set(apps);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
