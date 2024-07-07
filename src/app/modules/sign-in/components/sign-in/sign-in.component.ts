import { Component, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth/auth.service';
import { appName } from './sign-in.config';
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'tn-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {

  protected readonly appName = appName;

  form: FormGroup;

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  get email(): AbstractControl<string, string> | null {
    return this.form.get('email');
  }

  get password(): AbstractControl<string, string> | null {
    return this.form.get('password');
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService,
  ) {
    this.form = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async submit(): Promise<void> {
    if (this.validateEmail() === false) {
      this.errorMessage = 'Enter valid email address';
      return;
    }

    if (this.validatePassword() === false) {
      this.errorMessage = 'Enter password';
      return;
    }

    this.errorMessage = '';

    this.loadingService.show();

    try {
      await this.authService.signIn(this.email?.value ?? '', this.password?.value ?? '');
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  validateEmail(): boolean {
    return this.email?.valid ?? false;
  }

  validatePassword(): boolean {
    return this.password?.valid ?? false;
  }
}
