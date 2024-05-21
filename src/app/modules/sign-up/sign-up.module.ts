import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routes } from './sign-up.routes';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthService } from '../../services/auth/auth.service';

@NgModule({
  providers: [
    provideRouter(routes),
    AuthService
  ],
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent
  ],
})
export class SignUpModule { }
