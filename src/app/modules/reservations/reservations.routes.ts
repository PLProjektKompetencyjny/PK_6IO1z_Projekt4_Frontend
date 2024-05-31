import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth/auth.guard';
import { PrepareReservationComponent } from './components/prepare-reservation/prepare-reservation.component';

export const routes: Routes = [
  {
    path: ':room_id',
    component: PrepareReservationComponent,
    canActivate: [authGuard]
  },
];
