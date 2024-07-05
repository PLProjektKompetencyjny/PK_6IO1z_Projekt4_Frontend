import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ReservationService } from '../../../../services/reservation/reservation.service';
import { Reservation, ReservationStatus, ReservationStatusLabelsToDisplay } from '../reservation-edit/reservation.model';
import { CustomerService } from '../../../../services/customer/customer.service';
import { dateFormats } from '../../../../app.config';
import { Customer } from '../../../profile/customer.model';
import { getReservationStatusLabel } from './reservations-registry.config';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'tn-reservations-registry',
  templateUrl: './reservations-registry.component.html',
  styleUrl: './reservations-registry.component.scss'
})
export class ReservationsRegistryComponent {

  protected readonly dateFormats = dateFormats;
  protected readonly getReservationStatusLabel = getReservationStatusLabel;
  protected readonly ReservationStatus = ReservationStatus;
  protected readonly ReservationStatusLabelsToDisplay = ReservationStatusLabelsToDisplay;

  form: FormGroup;

  reservations: Reservation[] = [];
  customers: Customer[] = [];

  get reservation_start_date(): AbstractControl<Date, Date> | null {
    return this.form.get('reservation_start_date');
  }

  get reservation_end_date(): AbstractControl<Date, Date> | null {
    return this.form.get('reservation_end_date');
  }

  get reservation_status_id(): AbstractControl<ReservationStatus, ReservationStatus> | null {
    return this.form.get('reservation_status_id');
  }

  get reservation_customer_id(): AbstractControl<number, number> | null {
    return this.form.get('reservation_customer_id');
  }

  constructor(
    protected readonly authService: AuthService,
    private readonly reservationsService: ReservationService,
    protected readonly customersService: CustomerService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      reservation_start_date: [undefined],
      reservation_end_date: [undefined],
      reservation_status_id: [undefined],
      reservation_customer_id: [this.authService.session?.is_admin ? undefined : this.authService.session?.user_id],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getCustomers();
  }

  async getData(): Promise<void> {
    await this.getReservations();
  }

  async getReservations(): Promise<void> {
    try {
      const reservations = await this.reservationsService.get({
        reservation_start_date: this.reservation_start_date?.value ? `>${this.reservation_start_date?.value}` : undefined,
        reservation_end_date: this.reservation_end_date?.value ? `<${this.reservation_end_date?.value}` : undefined,
        reservation_status_id: this.reservation_status_id?.value,
        reservation_customer_id: this.reservation_customer_id?.value,
      });

      this.reservations = reservations.filter(({ reservation_status_id }) => reservation_status_id !== ReservationStatus.NO_SHOW);
    } catch (e) {
      console.error(e);
    }
  }

  async getCustomers(): Promise<void> {
    try {
      this.customers = await this.customersService.get();
    } catch (e) {
      console.error(e);
    }
  }

  async cancelReservation(reservation_id: number): Promise<void> {
    if (confirm('Are you sure you want to cancel reservation?') === false) {
      return;
    }

    const relatedReservationEntries = this.reservations.filter(r => r.reservation_id === reservation_id);

    try {
      for (const { reservation_id, reservation_room_id } of relatedReservationEntries) {
        await this.reservationsService.removeRoomFromReservation(reservation_id, reservation_room_id);
      }

      this.reservations = this.reservations.filter(r => r.reservation_id !== reservation_id);
    } catch (e) {
      console.error(e);
    }
  }

  async removeReservationRoom(reservation_id: number, reservation_room_id: number): Promise<void> {
    if (confirm('Are you sure you want to remove room from the reservation?') === false) {
      return;
    }

    try {
      await this.reservationsService.removeRoomFromReservation(reservation_id, reservation_room_id);

      this.reservations = this.reservations.filter(r => r.reservation_id !== reservation_id && r.reservation_room_id !== reservation_room_id);
    } catch (e) {
      console.error(e);
    }
  }

  getCustomerDisplay(customer_id: number): string {
    const customer = this.customers.find(c => c.customer_id === customer_id);
    return this.customersService.display(customer!);
  }

  clearFilters(): void {
    this.form.reset();
  }

}
