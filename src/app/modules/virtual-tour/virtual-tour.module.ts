import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './virtual-tour.routes';
import { VirtualTourComponent } from './components/virtual-tour/virtual-tour.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@NgModule({
  providers: [provideRouter(routes)],
  declarations: [
    VirtualTourComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
})
export class VirtualTourModule { }
