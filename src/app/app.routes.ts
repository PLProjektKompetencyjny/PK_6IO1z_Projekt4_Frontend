import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Start your vacations with TravelNest | Best place to visit, travel to & explore',
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
