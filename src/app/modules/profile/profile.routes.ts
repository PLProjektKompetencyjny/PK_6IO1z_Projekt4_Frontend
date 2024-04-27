import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';
import { SecurityComponent } from './components/security/security.component';

export const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
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
