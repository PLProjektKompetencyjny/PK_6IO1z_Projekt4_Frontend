import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, provideRouter } from '@angular/router';

import { routes } from './home.routes';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { RoomComponent } from '../rooms/components/room/room.component';

@NgModule({
  providers: [provideRouter(routes)],
  declarations: [
    HomeComponent,
  ],
  imports: [
    RouterLink,
    CommonModule,
    CarouselModule,
    HeaderComponent,
    RoomComponent,
  ]
})
export class HomeModule { }
