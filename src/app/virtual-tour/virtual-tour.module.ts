import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './virtual-tour.routes';
import { VirtualTourComponent } from './virtual-tour/virtual-tour.component';

@NgModule({
  providers: [provideRouter(routes)],
  declarations: [
    VirtualTourComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
})
export class VirtualTourModule { }
