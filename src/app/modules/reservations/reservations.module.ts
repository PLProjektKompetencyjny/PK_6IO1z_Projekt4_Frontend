import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { routes } from './reservations.routes';
import { ServiceService } from '../../services/service/service.service';
import { ReservationEditComponent } from './components/reservation-edit/reservation-edit.component';
import { ReservationsRegistryComponent } from './components/reservations-registry/reservations-registry.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RoomComponent } from '../rooms/components/room/room.component';

@NgModule({
  providers: [
    provideRouter(routes),
    ServiceService,
  ],
  declarations: [
    ReservationEditComponent,
    ReservationsRegistryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    RoomComponent,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class ReservationsModule { }
