import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsService } from 'angular2-notifications';
import { appName } from './sign-up.config';
import { PasswordStrengthValidator } from '../../../../shared/validators/password-strength.validator';
import { AuthService } from '../../../../services/auth/auth.service';
import { Step } from './sign-up.model';
import { Customer } from '../../../profile/customer.model';
import { PhoneValidator } from '../../../../shared/validators/phone.validator';
import { NipValidator } from '../../../../shared/validators/nip.validator';
import { getControlErrors } from '../../../../shared/validators/utils';
import { CityValidator } from '../../../../shared/validators/city.validator';
import { PostalCodeValidator } from '../../../../shared/validators/postal-code.validator';
import { StreetValidator } from '../../../../shared/validators/street.validator';
import { BuildingNumberValidator } from '../../../../shared/validators/building-number.validator';
import { SurnameValidator } from '../../../../shared/validators/surname.validator';
import { NameValidator } from '../../../../shared/validators/name.validator';
import { LoadingService } from '../../../../services/loading/loading.service';
import { BaseService } from '../../../../services/base.service';

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


  get nameErrors(): string[] {
    return getControlErrors(this.name);
  }

  get surnameErrors(): string[] {
    return getControlErrors(this.surname);
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


  get passwordErrors(): string[] {
    return getControlErrors(this.password);
  }

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  get name(): AbstractControl<string, string> | null {
    return this.form.get('name');
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
    private readonly loadingService: LoadingService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.form = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, NameValidator])],
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

    this.loadingService.show();

    const newUser: Customer = {
      customer_id: 0,
      customer_email: this.email?.value ?? '',
      customer_is_admin: false,
      customer_name: this.name?.value ?? '',
      customer_surname: this.surname?.value ?? '',
      customer_phone: this.phone?.value ?? '',
      customer_password: this.password?.value ?? '',
      customer_nip_number: this.nip?.value ?? '',
      customer_city: this.city?.value ?? '',
      customer_postal_code: this.postal_code?.value ?? '',
      customer_street: this.street?.value ?? '',
      customer_building_number: this.building_number?.value ?? '',
    };

    try {
      await this.authService.signUp(newUser);
      this.notificationsService.info('Information', 'We have sent you a confirmation e-mail for activation purposes!', BaseService.notificationOverride);
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
      if (this.name?.invalid) {
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
