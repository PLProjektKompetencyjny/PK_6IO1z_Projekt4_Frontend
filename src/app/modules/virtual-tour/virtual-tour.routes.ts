import { Routes } from '@angular/router';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';

export const routes: Routes = [
  {
    path: '**',
    component: VirtualTourComponent,
  }
];
