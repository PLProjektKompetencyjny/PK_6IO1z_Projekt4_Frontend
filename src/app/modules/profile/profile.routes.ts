import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';
import { SecurityComponent } from './components/security/security.component';
import { authGuard } from '../../guards/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'details',
        component: DetailsComponent,
      },
      {
        path: 'security',
        component: SecurityComponent,
      }
    ]
  },
];
