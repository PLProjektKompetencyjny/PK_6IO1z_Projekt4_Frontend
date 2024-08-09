import { Component } from '@angular/core';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';
import { appName } from '../../../../app.config';

@Component({
  selector: 'tn-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent {

  protected readonly appName = appName;

  maxSeconds: number = 10;
  seconds: number = 0;
  interval: ReturnType<typeof setInterval> = setInterval(this.countUp.bind(this), 1000);

  constructor(protected readonly router: RouterExtendedService) { }

  countUp(): void {
    if (this.seconds === this.maxSeconds) {
      this.router.navigateToHome();
      clearInterval(this.interval);
    }

    this.seconds += 1;
  }

}
