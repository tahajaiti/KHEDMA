import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../../core/models/favorite.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
  favorites: FavoriteOffer[];
  loading: boolean;
  error: string | null;
}

export const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

export const favoritesReducer = createReducer(
  initialState,

  on(FavoritesActions.loadFavorites, state => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    loading: false,
  })),

  on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
  })),

  on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    error,
  })),

  on(FavoritesActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter(f => f.id !== id),
  })),

  on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
    ...state,
    error,
  }))
);
