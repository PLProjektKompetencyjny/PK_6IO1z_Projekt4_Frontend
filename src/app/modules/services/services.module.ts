import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './services.routes';
import { ServiceService } from '../../services/service/service.service';
import { ServicesRegistryComponent } from './components/services-registry/services-registry.component';

@NgModule({
  providers: [
    provideRouter(routes),
    ServiceService,
  ],
  declarations: [
    ServicesRegistryComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    SimpleNotificationsModule.forRoot(),
  ]
})
export class ServicesModule { }
