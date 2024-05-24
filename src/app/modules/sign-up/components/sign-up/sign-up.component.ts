import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { appName } from './sign-up.config';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../../services/auth/auth.service';
import { Step } from './sign-up.model';
import { User } from '../../../profile/user.model';
import { PhoneValidator } from '../../../../shared/validators/phone.validator';
import { NipValidator } from '../../../../shared/validators/nip.validator';
import { getControlErrors } from '../../../../shared/validators/utils';
import { CityValidator } from '../../../../shared/validators/city.validator';
import { PostalCodeValidator } from '../../../../shared/validators/postal-code.validator';
import { StreetValidator } from '../../../../shared/validators/street.validator';
import { BuildingNumberValidator } from '../../../../shared/validators/building-number.validator';
import { FirstnameValidator } from '../../../../shared/validators/firstname.validator';
import { SurnameValidator } from '../../../../shared/validators/surname.validator';

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


  get firstnameErrors(): string[] {
    return getControlErrors(this.firstname);
  }

  get surnameErrors(): string[] {
    return getControlErrors(this.surname);
  }


  get passwordErrors(): string[] {
    return getControlErrors(this.password);
  }

  get phoneErrors(): string[] {
    return getControlErrors(this.phone);
  }


  get nipErrors(): string[] {
    return getControlErrors(this.nip);
  }

  get cityErrors(): string[] {
    return getControlErrors(this.city);
  }

  get postalCodeErrors(): string[] {
    return getControlErrors(this.postal_code);
  }

  get streetErrors(): string[] {
    return getControlErrors(this.street);
  }

  get buildingNumberErrors(): string[] {
    return getControlErrors(this.building_number);
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


  get email(): AbstractControl<string, string> | null {
    return this.form.get('email');
  }

  get phone(): AbstractControl<string, string> | null {
    return this.form.get('phone');
  }


  get nip(): AbstractControl<string, string> | null {
    return this.form.get('nip');
  }
  get city(): AbstractControl<string, string> | null {
    return this.form.get('city');
  }
  get postal_code(): AbstractControl<string, string> | null {
    return this.form.get('postal_code');
  }
  get street(): AbstractControl<string, string> | null {
    return this.form.get('street');
  }
  get building_number(): AbstractControl<string, string> | null {
    return this.form.get('building_number');
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
      firstname: ['', Validators.compose([Validators.required, FirstnameValidator])],
      surname: ['', Validators.compose([Validators.required, SurnameValidator])],

      email: ['', Validators.compose([Validators.required, Validators.email])],
      phone: ['', Validators.compose([Validators.required, PhoneValidator])],

      nip: ['', Validators.compose([Validators.required, NipValidator])],
      city: ['', Validators.compose([Validators.required, CityValidator])],
      postal_code: ['', Validators.compose([Validators.required, PostalCodeValidator])],
      street: ['', Validators.compose([Validators.required, StreetValidator])],
      building_number: ['', Validators.compose([Validators.required, BuildingNumberValidator])],

      password: ['', Validators.compose([Validators.required, PasswordStrengthValidator])],
      confirmPassword: ['', Validators.required],
    });
  }

  async submit(): Promise<void> {
    if (this.validatePasswords() === false || this.form.valid === false) {
      return;
    }

    const newUser: User = {
      id: 0,
      email: this.email?.value ?? '',
      is_admin: false,
      firstname: this.firstname?.value ?? '',
      surname: this.surname?.value ?? '',
      phone: this.phone?.value ?? '',
      password: this.password?.value ?? '',
      nip: this.nip?.value ?? '',
      city: this.city?.value ?? '',
      postal_code: this.postal_code?.value ?? '',
      street: this.street?.value ?? '',
      building_number: this.building_number?.value ?? '',
    };

    try {
      await this.authService.signUp(newUser);
    } catch (e) {
      console.error(e);
    } finally {
      this.errorMessage = '';
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

    if (this.currentStep === Step.ContactInfo && step === Step.Address) {
      if (this.email?.invalid) {
        this.errorMessage = 'Enter valid email address'
        return;
      }

      if (this.phone?.invalid) {
        this.errorMessage = 'Enter valid phone number';
        return;
      }
    }

    if (this.currentStep === Step.Address && step === Step.Password) {
      if (this.nip?.invalid) {
        this.errorMessage = 'Enter valid NIP';
        return;
      }

      if (this.city?.invalid) {
        this.errorMessage = 'Enter valid city';
        return;
      }

      if (this.postal_code?.invalid) {
        this.errorMessage = 'Enter valid postal code';
        return;
      }

      if (this.street?.invalid) {
        this.errorMessage = 'Enter valid street';
        return;
      }

      if (this.building_number?.invalid) {
        this.errorMessage = 'Enter valid building number';
        return;
      }
    }

    this.errorMessage = '';
    this.currentStep = step;
  }
}
