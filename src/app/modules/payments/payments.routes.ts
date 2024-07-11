import { Routes } from '@angular/router';
import { PaymentSuccessComponent } from './components/payment-success/payment-success.component';
import { PaymentFailComponent } from './components/payment-fail/payment-fail.component';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'success',
        component: PaymentSuccessComponent,
      },
      {
        path: 'fail',
        component: PaymentFailComponent,
      }
    ]
  },
];
