import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './profile.routes';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';
import { SecurityComponent } from './components/security/security.component';
import { CustomerService } from '../../services/customer/customer.service';

@NgModule({
  providers: [
    provideRouter(routes),
    CustomerService,
  ],
  declarations: [
    ProfileComponent,
    DetailsComponent,
    SecurityComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
  ],
})
export class ProfileModule { }
