import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';

import { routes } from './profile.routes';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';
import { SecurityComponent } from './components/security/security.component';

@NgModule({
  providers: [provideRouter(routes)],
  declarations: [
    ProfileComponent,
    DetailsComponent,
    SecurityComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    HeaderComponent
  ]
})
export class ProfileModule { }
