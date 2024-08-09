import { Component } from '@angular/core';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';
import { appName } from '../../../../app.config';

@Component({
  selector: 'tn-payment-fail',
  templateUrl: './payment-fail.component.html',
  styleUrl: './payment-fail.component.scss'
})
export class PaymentFailComponent {

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
