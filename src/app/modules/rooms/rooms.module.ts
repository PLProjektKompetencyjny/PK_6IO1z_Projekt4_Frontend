import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, provideRouter } from '@angular/router';
import { RoomService } from '../../services/room/room.service';
import { routes } from './rooms.routes';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RoomsRegistryComponent } from './components/rooms-registry/rooms-registry.component';
import { RoomEditComponent } from './components/room-edit/room-edit.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { RoomComponent } from './components/room/room.component';
import { RoomsMgmtRegistryComponent } from './components/rooms-mgmt-registry/rooms-mgmt-registry.component';

@NgModule({
  providers: [
    provideRouter(routes),
    RoomService,
  ],
  declarations: [
    RoomsRegistryComponent,
    RoomsMgmtRegistryComponent,
    RoomEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    RoomComponent,
    SimpleNotificationsModule.forRoot(),
  ],
})
export class RoomsModule { }
