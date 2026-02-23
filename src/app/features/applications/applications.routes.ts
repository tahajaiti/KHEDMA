import { Routes } from '@angular/router';

export const applicationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./applications-page/applications-page').then(m => m.ApplicationsPage),
  },
];
