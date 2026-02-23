import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideMapPin, lucideExternalLink, lucideTrash2 } from '@ng-icons/lucide';

@Component({
  selector: 'app-favorite-card',
  standalone: true,
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideMapPin, lucideExternalLink, lucideTrash2 })],
  templateUrl: './favorite-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteCard {
  favorite = input.required<FavoriteOffer>();
  remove = output<FavoriteOffer>();

  onRemove(): void {
    this.remove.emit(this.favorite());
  }
}
