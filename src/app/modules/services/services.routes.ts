import { Routes } from '@angular/router';
import { adminGuard } from '../../guards/admin/admin.guard';
import { ServicesRegistryComponent } from './components/services-registry/services-registry.component';

export const routes: Routes = [
  {
    path: '',
    component: ServicesRegistryComponent,
    canActivate: [adminGuard],
  },
];
