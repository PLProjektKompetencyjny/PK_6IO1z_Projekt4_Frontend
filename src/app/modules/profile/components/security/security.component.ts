import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'tn-security',
  templateUrl: './security.component.html',
  styleUrl: './security.component.scss'
})
export class SecurityComponent {

  form: FormGroup;

  get newPasswordErrors(): string[] {
    const newPasswordErrors = this.form.get('newPassword')?.errors;
    if (newPasswordErrors === null) {
      return [];
    }


    const parsedErrors: string[] = [];
    for (const key in newPasswordErrors) {
      if (Object.prototype.hasOwnProperty.call(newPasswordErrors, key) && key !== 'required') {
        parsedErrors.push(newPasswordErrors[key]);
      }
    }

    return parsedErrors;
  }

  get newPassword(): string {
    return this.form.get('newPassword')?.value;
  }

  get confirmPassword(): string {
    return this.form.get('confirmPassword')?.value;
  }

  /**
   * An error message to display after submittion.
   */
  errorMessage: string = '';

  constructor(
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private readonly loadingService: LoadingService,
  ) {
    this.form = this.formBuilder.group({
      newPassword: ['', Validators.compose([
        Validators.required, PasswordStrengthValidator
      ])],
      confirmPassword: ['', Validators.required]
    });
  }

  /**
   * Validates new provided password
   * and makes a HTTP request to the API
   * in order to request password change.
   */
  async changePassword(): Promise<void> {
    if (this.validatePasswords() === false) {
      return;
    }

    this.loadingService.show();

    try {
      await this.authService.updatePassword(this.newPassword);
    } catch (e) {
      console.error(e);
    } finally {
      this.errorMessage = '';
    }

    this.loadingService.hide();
  }

  /**
   * Validates new password with the confirmed one.
   * @returns `true` when they are the same; in other scenario `false`.
   */
  validatePasswords(): boolean {
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords are not the same';
      return false;
    }

    return true;
  }
}
