import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth/auth.guard';
import { ReservationsRegistryComponent } from './components/reservations-registry/reservations-registry.component';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: ReservationsRegistryComponent,
    canActivate: [authGuard],
    pathMatch: 'full'
  },
  {
    path: ':reservation_id',
    component: ReservationEditComponent,
    canActivate: [authGuard]
  },
];
