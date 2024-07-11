import { Routes } from '@angular/router';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: ':user_reset_password_code',
    component: ResetPasswordComponent,
  },
  {
    path: '**',
    component: ResetPasswordComponent,
  },
];
