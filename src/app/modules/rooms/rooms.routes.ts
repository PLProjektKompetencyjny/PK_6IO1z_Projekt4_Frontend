import { Routes } from '@angular/router';

import { RoomsRegistryComponent } from './components/rooms-registry/rooms-registry.component';
import { RoomEditComponent } from './components/room-edit/room-edit.component';
import { RoomsMgmtRegistryComponent } from './components/rooms-mgmt-registry/rooms-mgmt-registry.component';

import { adminGuard } from '../../guards/admin/admin.guard';

export const routes: Routes = [
  {
    path: '',
    component: RoomsRegistryComponent,
    pathMatch: 'full',
  },
  {
    path: 'mgmt',
    component: RoomsMgmtRegistryComponent,
    pathMatch: 'full',
    canActivate: [adminGuard],
  },
  {
    path: ':room_id',
    component: RoomEditComponent,
    canActivate: [adminGuard],
  },
];
