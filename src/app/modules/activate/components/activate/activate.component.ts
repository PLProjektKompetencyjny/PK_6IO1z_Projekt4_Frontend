import { Component, OnInit } from '@angular/core';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';
import { appName } from '../../../../app.config';
import { LoadingService } from '../../../../services/loading/loading.service';
import { NotificationsService } from 'angular2-notifications';
import { AuthService } from '../../../../services/auth/auth.service';
import { BaseService } from '../../../../services/base.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'tn-activate',
  templateUrl: './activate.component.html',
  styleUrl: './activate.component.scss'
})
export class ActivateComponent implements OnInit {

  protected readonly appName = appName;

  maxSeconds: number = 10;
  seconds: number = 0;
  interval: any = setInterval(this.countUp.bind(this), 1000);
  user_activation_code!: string;

  constructor(
    protected readonly router: RouterExtendedService,
    private readonly loading: LoadingService,
    private readonly notificationsService: NotificationsService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.user_activation_code = params['user_activation_code'];
    });
  }

  async ngOnInit(): Promise<void> {
    await this.activate();
  }

  async activate(): Promise<void> {
    this.loading.show();

    try {
      await this.authService.activate(this.user_activation_code);
      this.notificationsService.success('Success', 'Account activated successfully', BaseService.notificationOverride);
    } catch (e) {
      console.error(e);
    }

    this.loading.hide();
  }

  countUp(): void {
    if (this.seconds === this.maxSeconds) {
      this.router.navigateToSignIn('/home');
      clearInterval(this.interval);
    }

    this.seconds += 1;
  }
}
