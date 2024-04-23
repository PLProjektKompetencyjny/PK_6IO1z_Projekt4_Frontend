import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, provideRouter } from '@angular/router';
import { routes } from './sign-up.routes';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { HeaderComponent } from '../../shared/components/header/header.component';

@NgModule({
  providers: [provideRouter(routes)],
  declarations: [
    SignUpComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent
  ],
})
export class SignUpModule { }
