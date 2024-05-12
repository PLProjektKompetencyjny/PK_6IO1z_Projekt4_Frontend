import { Component } from '@angular/core';
import { appName } from './sign-up.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'tn-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  protected readonly appName = appName;

  form: FormGroup;

  get firstname(): string {
    return this.form.get('firstname')?.value;
  }

  get surname(): string {
    return this.form.get('surname')?.value;
  }

  get email(): string {
    return this.form.get('email')?.value;
  }

  get password(): string {
    return this.form.get('password')?.value;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.compose([
        Validators.required, PasswordStrengthValidator
      ])]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.valid === false) {
      return;
    }

    try {
      await this.authService.signUp(this.email, this.password, this.firstname, this.surname);
    } catch (e) {
      console.error(e);
    }
  }
}
