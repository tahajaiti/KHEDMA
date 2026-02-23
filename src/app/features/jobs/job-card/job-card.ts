import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Job } from '../../../core/models/job.model';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideExternalLink, lucideHeart, lucideClipboardList, lucideCheck } from '@ng-icons/lucide';

@Component({
  selector: 'app-job-card',
  standalone: true,
  imports: [RelativeTimePipe, TruncatePipe, NgIcon],
  viewProviders: [provideIcons({ lucideMapPin, lucideExternalLink, lucideHeart, lucideClipboardList, lucideCheck })],
  templateUrl: './job-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCard {
  job = input.required<Job>();
  isAuthenticated = input<boolean>(false);
  isFavorite = input<boolean>(false);
  isTracked = input<boolean>(false);

  addToFavorites = output<Job>();
  removeFromFavorites = output<Job>();
  trackApplication = output<Job>();

  onToggleFavorite(): void {
    if (this.isFavorite()) {
      this.removeFromFavorites.emit(this.job());
    } else {
      this.addToFavorites.emit(this.job());
    }
  }

  onTrack(): void {
    this.trackApplication.emit(this.job());
  }
}
