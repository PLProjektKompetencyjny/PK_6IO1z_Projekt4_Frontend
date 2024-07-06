import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { ReservationService } from '../../../../services/reservation/reservation.service';
import { GroupedReservation, Reservation, ReservationStatus, ReservationStatusLabelsToDisplay } from '../reservation-edit/reservation.model';
import { CustomerService } from '../../../../services/customer/customer.service';
import { dateFormats } from '../../../../app.config';
import { Customer } from '../../../profile/customer.model';
import { getReservationStatusLabel } from '../../reservations.config';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { InvoiceService } from '../../../../services/invoice/invoice.service';
import { BaseService } from '../../../../services/base.service';
import { NotificationsService } from 'angular2-notifications';
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'tn-reservations-registry',
  templateUrl: './reservations-registry.component.html',
  styleUrl: './reservations-registry.component.scss'
})
export class ReservationsRegistryComponent implements OnInit {

  protected readonly dateFormats = dateFormats;
  protected readonly getReservationStatusLabel = getReservationStatusLabel;
  protected readonly ReservationStatus = ReservationStatus;
  protected readonly ReservationStatusLabelsToDisplay = ReservationStatusLabelsToDisplay;

  form: FormGroup;

  //reservations: Reservation[] = [];
  groupedReservations: GroupedReservation[] = [];
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
    private readonly invoicesService: InvoiceService,
    private readonly notificationService: NotificationsService,
    private readonly loadingService: LoadingService,
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
    this.loadingService.show();

    try {
      let reservations = await this.reservationsService.get({
        reservation_start_date: this.reservation_start_date?.value ? `>${this.reservation_start_date?.value}` : undefined,
        reservation_end_date: this.reservation_end_date?.value ? `<${this.reservation_end_date?.value}` : undefined,
        reservation_status_id: this.reservation_status_id?.value,
        reservation_customer_id: this.reservation_customer_id?.value,
      });

      reservations = reservations.filter(({ reservation_status_id }) => reservation_status_id !== ReservationStatus.NO_SHOW);

      this.groupedReservations = reservations.reduce((grouped: GroupedReservation[], reservation: Reservation): GroupedReservation[] => {
        if (grouped.some(g => g.reservation_id === reservation.reservation_id) === false) {
          const reservation_room_ids: string = reservations
            .filter(r => r.reservation_id === reservation.reservation_id)
            .map(r => r.reservation_room_id)
            .join(',');
          grouped.push({
            ...reservation,
            reservation_room_ids,
          } satisfies GroupedReservation);
        }

        return grouped;
      }, []);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async getCustomers(): Promise<void> {
    this.loadingService.show();

    try {
      this.customers = await this.customersService.get();
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async downloadInvoice(reservation_id: number): Promise<void> {
    this.loadingService.show();

    try {
      await this.invoicesService.generateByReservationId(reservation_id);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async cancelReservation(reservation_id: number): Promise<void> {
    if (confirm('Are you sure you want to cancel reservation?') === false) {
      return;
    }

    this.loadingService.show();

    try {
      const reservation = this.groupedReservations.find(gr => gr.reservation_id === reservation_id);
      if (reservation) {
        const room_ids = reservation.reservation_room_ids.split(',');
        for (const room_id of room_ids) {
          await this.reservationsService.removeRoomFromReservation(reservation_id, +room_id);
        }
      }

      this.groupedReservations = this.groupedReservations.filter(r => r.reservation_id !== reservation_id);

      this.notificationService.success('Success', 'Reservation canceled successfully', BaseService.notificationOverride);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  getCustomerDisplay(customer_id: number): string {
    const customer = this.customers.find(c => c.customer_id === customer_id);
    return this.customersService.display(customer!);
  }

  clearFilters(): void {
    this.form.reset();
  }

}
