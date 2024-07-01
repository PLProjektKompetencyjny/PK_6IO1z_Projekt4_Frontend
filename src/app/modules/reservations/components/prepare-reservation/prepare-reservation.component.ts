import { Component, OnInit } from '@angular/core';
import { Room } from '../../../rooms/components/room-edit/room.model';
import { ActivatedRoute, Params } from '@angular/router';
import { CheckedServiceMgmt, Service, ServiceMgmt } from '../../../services/service.model';
import { ServiceService } from '../../../../services/service/service.service';
import { RoomService } from '../../../../services/room/room.service';
import { Reservation, ReservationRoomStatus, ReservationStatus } from './reservation.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { ReservationService } from '../../../../services/reservation/reservation.service';
import { NotificationsService } from 'angular2-notifications';
import { BaseService } from '../../../../services/base.service';
import { DatePipe } from '@angular/common';
import { dateFormats } from '../../../../app.config';
import { getControlErrors } from '../../../../shared/validators/utils';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NameValidator } from '../../../../shared/validators/name.validator';
import { SurnameValidator } from '../../../../shared/validators/surname.validator';
import { PhoneValidator } from '../../../../shared/validators/phone.validator';
import { NipValidator } from '../../../../shared/validators/nip.validator';
import { CityValidator } from '../../../../shared/validators/city.validator';
import { PostalCodeValidator } from '../../../../shared/validators/postal-code.validator';
import { StreetValidator } from '../../../../shared/validators/street.validator';
import { BuildingNumberValidator } from '../../../../shared/validators/building-number.validator';
import { Customer } from '../../../profile/customer.model';
import { CustomerService } from '../../../../services/customer/customer.service';

@Component({
  selector: 'tn-prepare-reservation',
  templateUrl: './prepare-reservation.component.html',
  styleUrl: './prepare-reservation.component.scss',
  providers: [DatePipe]
})
export class PrepareReservationComponent implements OnInit {
  room!: Room;
  reservation_id!: number;
  room_id!: number;
  servicesMgmt: ServiceMgmt[] = [];
  checkedServiceMgmt: CheckedServiceMgmt[] = [];
  start_date: Date = new Date();
  end_date: Date = new Date();
  reservation!: Reservation;

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

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
      customer_id: 0,
      customer_is_admin: false,
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

  get servicesTotal(): number {
    return this.checkedServiceMgmt.reduce((partialSum: number, { unit_price, quantity }): number =>
      partialSum + unit_price * quantity, 0
    );
  }

  get total(): number {
    return this.room.room_gross_price + this.servicesTotal;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly servicesService: ServiceService,
    private readonly roomsService: RoomService,
    protected readonly authService: AuthService,
    private readonly reservationsService: ReservationService,
    private readonly notificationsService: NotificationsService,
    private readonly datePipe: DatePipe,
    private readonly customersService: CustomerService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (isNaN(params['reservation_id']) === false) {
        this.reservation_id = +params['reservation_id'];
      }

      if (isNaN(params['room_id']) === false) {
        this.room_id = +params['room_id'];
      }

      this.start_date = new Date(JSON.parse(params['start_date']));
      this.end_date = new Date(JSON.parse(params['end_date']));
    });

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
    await this.getData();
  }

  async getData(): Promise<void> {
    if (this.reservation_id > 0) {
      await this.getReservation();
    } else {

      await this.getRoom();
      await this.getServices();
    }
  }

  async getReservation(): Promise<void> {
    if (!this.reservation_id) {
      return;
    }

    try {
      this.reservation = await this.reservationsService.getById(this.reservation_id);
      //await this.servicesService.getByReservationId(this.reservation_id);
    } catch (e) {
      console.error(e);
    }
  }

  async getRoom(): Promise<void> {
    try {
      this.room = await this.roomsService.getById(this.room_id);
    } catch (e) {
      console.error(e);
    }
  }

  async getServices(): Promise<void> {
    try {
      this.servicesMgmt = await this.servicesService.get();
    } catch (e) {
      console.error(e);
    }
  }

  async submitReservation(): Promise<void> {
    if (this.validate() === false) {
      return;
    }

    try {
      if (this.reservation_id > 0) {

      } else {
        await this.createReservation();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async createReservation(): Promise<void> {
    let new_customer_id: number = 0;
    /**
     * The case when logged user is receptionist 
     * and wants to book a room for new customer.
     */
    if (this.authService.session?.is_admin) {
      new_customer_id = await this.customersService.create(this.customer);
    }

    this.reservation = {
      reservation_id: 0,
      reservation_customer_id: this.authService.session?.is_admin ? new_customer_id : this.authService.session?.user_id ?? 0,
      reservation_status_id: ReservationStatus.WAITING_CONFIRMATION,
      reservation_number_of_adults: this.room.room_number_of_single_beds + this.room.room_number_of_double_beds * 2,
      reservation_number_of_children: this.room.room_number_of_child_beds,
      reservation_start_date: this.datePipe.transform(this.start_date, dateFormats.short)!,
      reservation_end_date: this.datePipe.transform(this.end_date, dateFormats.short)!,
      reservation_room_id: this.room.room_id,
      reservation_room_status_id: ReservationRoomStatus.RESERVED,
      reservation_last_modified_by: this.authService.session?.user_id ?? 0,
      reservation_last_modified_at: new Date()
    } satisfies Reservation;

    this.reservation_id = this.reservation.reservation_id = await this.reservationsService.create(this.reservation);
    await this.addServicesToReservation();
    await this.addInvoice();

    this.notificationsService.success('Success', 'Reservation created. We have sent you an e-mail with confirmation details', BaseService.notificationOverride);
  }

  async createCustomer(): Promise<void> {
    if (this.validateCustomer() === false) {
      return;
    }
  }

  async addServicesToReservation(): Promise<void> {
    for (const { id, name, unit_price, quantity } of this.checkedServiceMgmt) {
      const service = {
        service_id: id,
        service_name: name,
        service_price: unit_price,
        service_reservation_id: this.reservation.reservation_id,
        service_quantity: quantity,
        service_last_modified_by: this.authService.session?.user_id ?? 0,
        service_last_modified_at: new Date(),
      } satisfies Service;

      await this.reservationsService.addService(service);
    }
  }

  async addInvoice(): Promise<void> {
    // try {
    //   await this.invoicesService.create(this.invoice);
    // } catch(e) {
    //   console.error(e);
    // }
  }

  validate(): boolean {
    return this.validateServices();
  }

  validateServices(): boolean {
    if (this.checkedServiceMgmt.some(s => !s.quantity)) {
      this.notificationsService.error('Error', 'Enter quantity for each checked additional services', BaseService.notificationOverride);
      return false;
    }

    return true;
  }

  validateCustomer(): boolean {
    if (this.authService.session?.is_admin === false) {
      return true;
    }

    if (this.form.invalid) {
      this.errorMessage = 'Please, fill out data';
      return false;
    }

    return true;
  }

  onServiceChange({ target }: Event, service_id: number, quantity: number): void {
    const checked = (target as HTMLInputElement)?.checked ?? false;
    if (checked) {
      const serviceMgmt = this.servicesMgmt.find(s => s.id === service_id);
      if (serviceMgmt) {
        const checkedServiceMgmt = {
          ...serviceMgmt,
          quantity: isNaN(quantity) ? 0 : quantity,
        } satisfies CheckedServiceMgmt;

        this.checkedServiceMgmt.push(checkedServiceMgmt);
      }
    } else {
      this.checkedServiceMgmt = this.checkedServiceMgmt.filter(s => s.id !== service_id);
    }
  }

  onQuantityChange({ target }: Event, service_id: number): void {
    const quantity = (target as HTMLInputElement).valueAsNumber;
    const index = this.checkedServiceMgmt.findIndex(s => s.id === service_id);
    if (index !== -1) {
      this.checkedServiceMgmt[index].quantity = isNaN(quantity) ? 0 : quantity;
    }
  }

}
