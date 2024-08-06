import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoadingService } from '../../../../services/loading/loading.service';
import { appName } from '../../../../app.config';
import { ActivatedRoute, Params } from '@angular/router';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { getControlErrors } from '../../../../shared/validators/utils';
import { NotificationsService } from 'angular2-notifications';
import { BaseService } from '../../../../services/base.service';

@Component({
  selector: 'tn-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {


  protected readonly appName = appName;

  form: FormGroup;

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  user_reset_password_code!: string;

  get email(): AbstractControl<string, string> | null {
    return this.form.get('email');
  }

  get password(): AbstractControl<string, string> | null {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl<string, string> | null {
    return this.form.get('confirmPassword');
  }

  get passwordErrors(): string[] {
    return getControlErrors(this.password);
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService,
    private readonly route: ActivatedRoute,
    private readonly notificationsService: NotificationsService,
  ) {
    this.route.params.subscribe((params: Params) => {
      this.user_reset_password_code = params['user_reset_password_code'];
    });

    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.compose([Validators.required, PasswordStrengthValidator])],
      confirmPassword: ['', Validators.required],
    });
  }

  async submit(): Promise<void> {
    if (this.validateEmail() === false) {
      return;
    }

    if (this.validatePasswords() === false) {
      return;
    }

    this.errorMessage = '';
    this.loadingService.show();

    try {
      if (!this.user_reset_password_code) {
        await this.authService.resetPasswordMailRequest(this.email?.value ?? '');
        this.notificationsService.success('Success', 'We have sent you a reset password confirmation link to your e-mail', BaseService.notificationOverride);
      } else {
        await this.authService.resetPassword(this.user_reset_password_code, this.password?.value ?? '');
        this.notificationsService.success('Success', 'Password changed successfully', BaseService.notificationOverride);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.errorMessage = '';
    }

    this.loadingService.hide();
  }

  validateEmail(): boolean {
    if (this.user_reset_password_code) {
      return true;
    }

    if (this.email?.valid) {
      this.errorMessage = '';
      return true;
    }

    this.errorMessage = 'Enter valid email address';
    return false;
  }

  /**
   * Validates new password with the confirmed one.
   * @returns `true` when they are the same; in other scenario `false`.
   */
  validatePasswords(): boolean {
    if (!this.user_reset_password_code) {
      return true;
    }

    if (!this.password?.value || !this.confirmPassword?.value) {
      this.errorMessage = 'Enter passwords';
      return false;
    }

    if (this.password?.value !== this.confirmPassword?.value) {
      this.errorMessage = 'Passwords are not the same';
      return false;
    }

    this.errorMessage = '';
    return true;
  }
}
