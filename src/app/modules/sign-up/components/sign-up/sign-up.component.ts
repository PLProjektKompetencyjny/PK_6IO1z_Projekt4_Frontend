import { Component } from '@angular/core';
import { appName } from './sign-up.config';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../../services/auth/auth.service';
import { Step } from './sign-up.model';
import { User } from '../../../profile/user.model';

@Component({
  selector: 'tn-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  protected readonly appName = appName;
  protected currentStep: Step = Step.IntroduceYourself;
  protected readonly Step = Step;

  form: FormGroup;

  get passwordErrors(): string[] {
    const passwordErrors = this.form.get('password')?.errors;
    if (passwordErrors === null) {
      return [];
    }


    const parsedErrors: string[] = [];
    for (const key in passwordErrors) {
      if (Object.prototype.hasOwnProperty.call(passwordErrors, key) && key !== 'required') {
        parsedErrors.push(passwordErrors[key]);
      }
    }

    return parsedErrors;
  }

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  get firstname(): AbstractControl<string, string> | null {
    return this.form.get('firstname');
  }

  get surname(): AbstractControl<string, string> | null {
    return this.form.get('surname');
  }

  get phone(): AbstractControl<string, string> | null {
    return this.form.get('phone');
  }

  get email(): AbstractControl<string, string> | null {
    return this.form.get('email');
  }

  get password(): AbstractControl<string, string> | null {
    return this.form.get('password');
  }

  get confirmPassword(): AbstractControl<string, string> | null {
    return this.form.get('confirmPassword');
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
  ) {
    this.form = this.formBuilder.group({
      firstname: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.compose([
        Validators.required, PasswordStrengthValidator
      ])]],
      confirmPassword: ['', Validators.required],
    });
  }

  async submit(): Promise<void> {
    if (this.validatePasswords() === false || this.form.valid === false) {
      return;
    }

    this.errorMessage = '';

    const newUser: User = {
      id: '',
      email: this.email?.value ?? '',
      isAdmin: false,
      firstname: this.firstname?.value ?? '',
      surname: this.surname?.value ?? '',
      phone: this.surname?.value ?? '',
      password: this.password?.value ?? '',
      nip: '',
      city: '',
      postalCode: '',
      street: '',
      buildingNumber: '',
    };

    try {
      await this.authService.signUp(newUser);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Validates new password with the confirmed one.
   * @returns `true` when they are the same; in other scenario `false`.
   */
  validatePasswords(): boolean {
    if (this.password?.value !== this.confirmPassword?.value) {
      this.errorMessage = 'Passwords are not the same';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  /**
   * Moves to another or previous step of sign up process.
   * @param step A previous or next step.
   */
  moveToStep(step: Step): void {
    this.form.markAsTouched();
    if (this.currentStep === Step.IntroduceYourself && step === Step.ContactInfo) {
      if (this.firstname?.invalid) {
        this.errorMessage = 'Enter first name';
        return;
      }

      if (this.surname?.invalid) {
        this.errorMessage = 'Enter surname'
        return;
      }
    }

    if (this.currentStep === Step.ContactInfo && step === Step.Password) {
      if (this.email?.invalid) {
        this.errorMessage = 'Enter valid email address'
        return;
      }
    }

    this.errorMessage = '';
    this.currentStep = step;
  }
}
