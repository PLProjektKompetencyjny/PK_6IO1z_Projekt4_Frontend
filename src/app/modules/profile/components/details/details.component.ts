import { Component, OnInit } from '@angular/core';
import { Customer } from '../../customer.model';
import { CustomerService } from '../../../../services/customer/customer.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { getControlErrors } from '../../../../shared/validators/utils';
import { SurnameValidator } from '../../../../shared/validators/surname.validator';
import { PhoneValidator } from '../../../../shared/validators/phone.validator';
import { NipValidator } from '../../../../shared/validators/nip.validator';
import { CityValidator } from '../../../../shared/validators/city.validator';
import { PostalCodeValidator } from '../../../../shared/validators/postal-code.validator';
import { StreetValidator } from '../../../../shared/validators/street.validator';
import { BuildingNumberValidator } from '../../../../shared/validators/building-number.validator';
import { NameValidator } from '../../../../shared/validators/name.validator';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'tn-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  form: FormGroup;


  get nameErrors(): string[] {
    return getControlErrors(this.name);
  }

  get surnameErrors(): string[] {
    return getControlErrors(this.surname);
  }


  get emailErrors(): string[] {
    return getControlErrors(this.email);
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

  get customer(): Customer {
    return {
      customer_id: this.authService.session?.user_id ?? 0,
      customer_is_admin: this.authService.session?.is_admin ?? false,
      customer_name: this.name?.value ?? '',
      customer_surname: this.surname?.value ?? '',
      customer_email: this.email?.value ?? '',
      customer_phone: this.phone?.value ?? '',
      customer_nip_number: this.nip?.value ?? '',
      customer_city: this.city?.value ?? '',
      customer_postal_code: this.postal_code?.value ?? '',
      customer_street: this.street?.value ?? '',
      customer_building_number: this.building_number?.value ?? '',
      customer_last_modified_at: new Date(),
      customer_last_modified_by: this.authService.session?.user_id,
    } satisfies Customer;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly customerService: CustomerService,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService,
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
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getMe();
  }

  async getMe(): Promise<void> {
    this.loadingService.show();

    try {
      const customer = await this.customerService.me();
      this.mapCustomerToForm(customer);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async update(): Promise<void> {
    if (this.validateForm() === false) {
      return;
    }

    this.loadingService.show();

    try {
      await this.customerService.update(this.customer);
    } catch (e) {
      console.error(e);
    } finally {
      this.errorMessage = '';
    }

    this.loadingService.hide();
  }

  validateForm(): boolean {
    if (this.form.invalid) {
      this.errorMessage = 'Please, fill out data';
      return false;
    }

    if (this.email?.invalid) {
      this.errorMessage = 'Enter valid email';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  private mapCustomerToForm(customer: Customer): void {
    this.name?.setValue(customer.customer_name);
    this.surname?.setValue(customer.customer_surname);
    this.email?.setValue(customer.customer_email);
    this.phone?.setValue(customer.customer_phone);
    this.nip?.setValue(customer.customer_nip_number);
    this.city?.setValue(customer.customer_city);
    this.postal_code?.setValue(customer.customer_postal_code);
    this.street?.setValue(customer.customer_street);
    this.building_number?.setValue(customer.customer_building_number);
  }
}
