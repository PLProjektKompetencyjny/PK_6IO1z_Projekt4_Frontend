import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth/auth.guard';
import { ReservationEditComponent as ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';

export const routes: Routes = [
  {
    path: ':reservation_id',
    component: ReservationEditComponent,
    canActivate: [authGuard]
  },
];
