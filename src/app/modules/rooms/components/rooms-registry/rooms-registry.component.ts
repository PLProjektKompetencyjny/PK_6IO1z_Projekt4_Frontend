import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RoomService } from '../../../../services/room/room.service';
import { Room } from '../room-edit/room.model';
import { Customer } from '../../../profile/customer.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { CustomerService } from '../../../../services/customer/customer.service';
import { NameValidator } from '../../../../shared/validators/name.validator';
import { SurnameValidator } from '../../../../shared/validators/surname.validator';
import { PhoneValidator } from '../../../../shared/validators/phone.validator';
import { NipValidator } from '../../../../shared/validators/nip.validator';
import { CityValidator } from '../../../../shared/validators/city.validator';
import { PostalCodeValidator } from '../../../../shared/validators/postal-code.validator';
import { StreetValidator } from '../../../../shared/validators/street.validator';
import { BuildingNumberValidator } from '../../../../shared/validators/building-number.validator';
import { getControlErrors } from '../../../../shared/validators/utils';
import { NotificationsService } from 'angular2-notifications';
import { BaseService } from '../../../../services/base.service';
import { Reservation } from '../../../reservations/components/reservation-edit/reservation.model';
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'tn-rooms-registry',
  templateUrl: './rooms-registry.component.html',
  styleUrl: './rooms-registry.component.scss'
})
export class RoomsRegistryComponent implements OnInit {

  form: FormGroup;
  formCustomer: FormGroup;

  rooms: Room[] = [];
  new_reservation_id: number = 0;
  customers: Customer[] = [];
  chosen_customer_id: number = this.authService.session?.is_admin ? 0 : this.authService.session?.user_id ?? 0;
  show_add_customer: boolean = false;

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  /**
   * An error message to display.
   * For each step error message is different.
   */
  customerErrorMessage: string = '';

  protected readonly now = new Date();

  get start_date(): AbstractControl<Date, Date> | null {
    return this.form.get('start_date');
  }

  get end_date(): AbstractControl<Date, Date> | null {
    return this.form.get('end_date');
  }

  get number_of_double_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_double_beds');
  }

  get number_of_single_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_single_beds');
  }

  get number_of_child_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_child_beds');
  }


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

  get name(): AbstractControl<string, string> | null {
    return this.formCustomer.get('name');
  }

  get surname(): AbstractControl<string, string> | null {
    return this.formCustomer.get('surname');
  }


  get email(): AbstractControl<string, string> | null {
    return this.formCustomer.get('email');
  }

  get phone(): AbstractControl<string, string> | null {
    return this.formCustomer.get('phone');
  }

  get nip(): AbstractControl<string, string> | null {
    return this.formCustomer.get('nip');
  }


  get city(): AbstractControl<string, string> | null {
    return this.formCustomer.get('city');
  }

  get postal_code(): AbstractControl<string, string> | null {
    return this.formCustomer.get('postal_code');
  }

  get street(): AbstractControl<string, string> | null {
    return this.formCustomer.get('street');
  }

  get building_number(): AbstractControl<string, string> | null {
    return this.formCustomer.get('building_number');
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
    private readonly roomsService: RoomService,
    protected readonly authService: AuthService,
    protected readonly customersService: CustomerService,
    private readonly notificationsService: NotificationsService,
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly loadingService: LoadingService,
  ) {
    this.form = this.formBuilder.group({
      start_date: [undefined, Validators.required],
      end_date: [undefined, Validators.required],
      number_of_double_beds: [undefined],
      number_of_single_beds: [undefined],
      number_of_child_beds: [undefined],
    });

    this.formCustomer = this.formBuilder.group({
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

    this.applyQueryParams();
  }

  private applyQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      for (const [key, value] of Object.entries(params)) {
        this.form.controls[key]?.setValue(value);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getCustomers();
  }

  async getCustomers(): Promise<void> {
    if (this.authService.session?.is_admin === false) {
      return;
    }

    this.loadingService.show();

    try {
      this.customers = await this.customersService.get(undefined);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async getRooms(): Promise<void> {
    if (this.validateForm() === false) {
      return;
    }

    this.loadingService.show();

    try {
      this.rooms = await this.roomsService.get({
        room_number_of_single_beds: this.number_of_single_beds?.value,
        room_number_of_double_beds: this.number_of_double_beds?.value,
        room_number_of_child_beds: this.number_of_child_beds?.value,
        room_reservation_start_date: this.start_date?.value,
        room_reservation_end_date: this.end_date?.value
      });
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  validateForm(): boolean {
    if (this.start_date?.invalid) {
      this.errorMessage = 'Enter valid start date';
      return false;
    }

    if (this.end_date?.invalid) {
      this.errorMessage = 'Enter valid end date';
      return false;
    }

    if (!this.chosen_customer_id && this.authService.session) {
      this.errorMessage = 'Customer must be specified';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  async createCustomer(): Promise<void> {
    if (this.validateCustomerForm() === false) {
      return;
    }

    try {
      const new_customer_id = await this.customersService.create(this.customer);
      this.customers.push({
        ...this.customer,
        customer_id: new_customer_id,
      });

      this.show_add_customer = false;

      this.notificationsService.success('Success', 'Customer created', BaseService.notificationOverride);

      this.formCustomer.reset();
    } catch (e) {
      console.error(e);
    }
  }

  validateCustomerForm(): boolean {
    if (this.formCustomer.invalid) {
      this.customerErrorMessage = 'Please, fill out data';
      return false;
    }

    if (this.email?.invalid) {
      this.customerErrorMessage = 'Enter valid email';
      return false;
    }

    this.customerErrorMessage = '';
    return true;
  }

  roomBooked({ reservation_id, reservation_room_id }: Reservation): void {
    this.new_reservation_id = reservation_id;
    this.rooms = this.rooms.filter(r => r.room_id !== reservation_room_id);
  }

  clearFilters(): void {
    this.form.reset();
  }

}
