import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { routes } from './reset-password.routes';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

@NgModule({
  providers: [
    provideRouter(routes),
    AuthService,
  ],
  declarations: [
    ResetPasswordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ResetPasswordModule { }
