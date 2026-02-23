import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteOffer } from '../../../core/models/favorite.model';
import { selectAllFavorites, selectFavoritesLoading } from '../../../store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../store/favorites/favorites.actions';
import { FavoriteCard } from '../favorite-card/favorite-card';
import { LoadingSpinner } from '../../../shared/components/loading-spinner/loading-spinner';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideHeart } from '@ng-icons/lucide';

@Component({
  selector: 'app-favorites-page',
  standalone: true,
  imports: [FavoriteCard, LoadingSpinner, AsyncPipe, NgIcon],
  viewProviders: [provideIcons({ lucideHeart })],
  templateUrl: './favorites-page.html',
})
export class FavoritesPage implements OnInit {
  private store = inject(Store);
  private auth = inject(AuthService);

  favorites$ = this.store.select(selectAllFavorites);
  loading$ = this.store.select(selectFavoritesLoading);

  ngOnInit(): void {
    const userId = this.auth.currentUser()?.id;
    if (userId) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId }));
    }
  }

  removeFavorite(favorite: FavoriteOffer): void {
    if (favorite.id) {
      this.store.dispatch(FavoritesActions.removeFavorite({ id: favorite.id }));
    }
  }
}
