import { Component } from '@angular/core';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';

@Component({
  selector: 'tn-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {

  maxSeconds: number = 10;
  seconds: number = 0;
  interval: any = setInterval(this.countUp.bind(this), 1000);

  constructor(protected readonly router: RouterExtendedService) { }

  countUp(): void {
    if (this.seconds === this.maxSeconds) {
      this.router.navigateToHome();
      clearInterval(this.interval);
    }

    this.seconds += 1;
  }

}
