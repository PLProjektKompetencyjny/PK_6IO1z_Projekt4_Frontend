import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { AuthService } from '../../services/auth/auth.service';
import { routes } from './sign-in.routes';
import { SignInComponent } from './components/sign-in/sign-in.component';

@NgModule({
  providers: [
    provideRouter(routes),
    AuthService
  ],
  declarations: [
    SignInComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
  ]
})
export class SignInModule { }
