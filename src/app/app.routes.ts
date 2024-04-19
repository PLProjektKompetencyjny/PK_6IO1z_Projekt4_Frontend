import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Start your vacations with TravelNest | Best place to visit, travel to & explore',
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule)
  },
  {
    title: 'Checkout our residences, apartments & rooms at TravelNest | Explore with virtual tour',
    path: 'virtual-tour',
    loadChildren: () => import('./virtual-tour/virtual-tour.module').then(m => m.VirtualTourModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
