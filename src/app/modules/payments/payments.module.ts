import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, RouterModule } from '@angular/router';
import { NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './payments.routes';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailComponent } from './components/payment-fail/payment-fail.component';

@NgModule({
  providers: [
    provideRouter(routes),
  ],
  declarations: [
    PaymentSuccessComponent,
    PaymentFailComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbProgressbarModule,
  ]
})
export class PaymentsModule { }
