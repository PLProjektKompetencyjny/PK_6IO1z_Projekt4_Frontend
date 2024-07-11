import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ActivateComponent } from './components/activate/activate.component';
import { AuthService } from '../../services/auth/auth.service';
import { routes } from './activate.routes';

@NgModule({
  providers: [
    provideRouter(routes),
    AuthService
  ],
  declarations: [
    ActivateComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HeaderComponent,
    NgbProgressbarModule,
  ]
})
export class ActivateModule { }
