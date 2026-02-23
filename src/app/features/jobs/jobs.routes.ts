import { Routes } from '@angular/router';

export const jobsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./job-search/job-search').then(m => m.JobSearch),
  },
];
