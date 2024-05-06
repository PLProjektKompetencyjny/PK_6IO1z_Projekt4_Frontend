import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: 'Start your vacations with TravelNest | Best place to visit, travel to & explore',
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    title: 'Checkout our residences, apartments & rooms at TravelNest | Explore with virtual tour',
    path: 'virtual-tour',
    loadChildren: () => import('./modules/virtual-tour/virtual-tour.module').then(m => m.VirtualTourModule)
  },
  {
    title: 'Your account details',
    path: 'profile',
    loadChildren: () => import('./modules/profile/profile.module').then(m => m.ProfileModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
