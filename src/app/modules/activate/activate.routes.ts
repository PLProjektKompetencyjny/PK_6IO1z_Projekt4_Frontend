import { Routes } from '@angular/router';
import { ActivateComponent } from './components/activate/activate.component';

export const routes: Routes = [
  {
    path: ':user_activation_code',
    component: ActivateComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/sign-in'
  }
];
