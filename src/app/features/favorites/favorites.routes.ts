import { Routes } from '@angular/router';

export const favoritesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./favorites-page/favorites-page').then(m => m.FavoritesPage),
  },
];
