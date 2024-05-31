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
    title: 'Register new account',
    path: 'sign-up',
    loadChildren: () => import('./modules/sign-up/sign-up.module').then(m => m.SignUpModule)
  },
  {
    title: 'Sign in to your account',
    path: 'sign-in',
    loadChildren: () => import('./modules/sign-in/sign-in.module').then(m => m.SignInModule)
  },
  {
    title: 'Find available rooms at TravelNest',
    path: 'rooms',
    loadChildren: () => import('./modules/rooms/rooms.module').then(m => m.RoomsModule)
  },
  {
    title: 'Edit additional services for reservations',
    path: 'services',
    loadChildren: () => import('./modules/services/services.module').then(m => m.ServicesModule)
  },
  {
    title: 'Check in hotel room at TravelNest | Reservation',
    path: 'reservations',
    loadChildren: () => import('./modules/reservations/reservations.module').then(m => m.ReservationsModule)
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
