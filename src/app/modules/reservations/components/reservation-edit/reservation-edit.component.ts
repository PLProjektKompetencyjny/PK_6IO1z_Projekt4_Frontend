import { Component, OnInit } from '@angular/core';
import { Room } from '../../../rooms/components/room-edit/room.model';
import { ActivatedRoute, Params } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Service } from '../../../services/service.model';
import { ServiceService } from '../../../../services/service/service.service';
import { RoomService } from '../../../../services/room/room.service';
import { Reservation, ReservationStatus } from './reservation.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { ReservationService } from '../../../../services/reservation/reservation.service';
import { NotificationsService } from 'angular2-notifications';
import { BaseService } from '../../../../services/base.service';
import { dateFormats, taxInPercentage } from '../../../../app.config';
import { Customer } from '../../../profile/customer.model';
import { CustomerService } from '../../../../services/customer/customer.service';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';
import { InvoiceService } from '../../../../services/invoice/invoice.service';
import { Invoice } from '../../../../shared/models/invoice.model';
import { getReservationStatusLabel } from '../../reservations.config';
import { LoadingService } from '../../../../services/loading/loading.service';
import { ConfirmationDialogService } from '../../../../services/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'tn-reservation-edit',
  templateUrl: './reservation-edit.component.html',
  styleUrl: './reservation-edit.component.scss',
  providers: [DatePipe]
})
export class ReservationEditComponent implements OnInit {

  protected readonly dateFormats = dateFormats;
  protected readonly taxInPercentage = taxInPercentage;
  protected readonly getReservationStatusLabel = getReservationStatusLabel;

  room!: Room;
  reservation_id!: number;
  room_id!: number;
  availableServices: Service[] = [];
  reservationServices: Service[] = [];
  invoices: Invoice[] = [];
  start_date: Date = new Date();
  get parsed_start_date(): string {
    return this.datePipe.transform(this.start_date, dateFormats.short)!;
  }

  end_date: Date = new Date();
  get parsed_end_date(): string {
    return this.datePipe.transform(this.end_date, dateFormats.short)!;
  }

  get days(): number {
    const utcEndDate = Date.UTC(
      this.end_date.getFullYear(),
      this.end_date.getMonth(),
      this.end_date.getDate(),
      this.end_date.getHours(),
      this.end_date.getMinutes(),
      this.end_date.getSeconds(),
      this.end_date.getMilliseconds()
    );
    const utcStartDate = Date.UTC(
      this.start_date.getFullYear(),
      this.start_date.getMonth(),
      this.start_date.getDate(),
      this.start_date.getHours(),
      this.start_date.getMinutes(),
      this.start_date.getSeconds(),
      this.start_date.getMilliseconds()
    );

    return Math.ceil((utcEndDate - utcStartDate) / 86400000);
  }

  get reservation_status_id(): number {
    return this.reservations[0]?.reservation_status_id ?? 0;
  }

  /**
   * An error message to display.
   * For each step error message is different.
   */
  errorMessage: string = '';

  rooms: Room[] = [];
  reservations: Reservation[] = [];
  customer!: Customer;
  disableEdit: boolean = true;

  get servicesTotal(): number {
    return this.reservationServices.reduce((partialSum: number, { service_price, service_quantity }): number =>
      partialSum + service_price * service_quantity, 0
    );
  }

  get servicesPreviewTotal(): number {
    return this.availableServices.reduce((partialSum: number, { service_price, service_quantity }): number =>
      partialSum + service_price * (!service_quantity ? 0 : service_quantity), 0
    );
  }

  get roomsTotal(): number {
    return this.reservations.reduce((
      partialSum: number,
      {
        reservation_room_id,
        reservation_number_of_adults,
        reservation_number_of_children,
      }): number => {
      const room = this.rooms.find(r => r.room_id === reservation_room_id)!;
      if (!room) {
        return partialSum;
      }

      const roomTotal = (
        (
          room.room_gross_price_adult * reservation_number_of_adults
        ) +
        (
          room.room_gross_price_child * reservation_number_of_children
        ) + room.room_gross_price
      ) * this.days;

      return partialSum + roomTotal;
    }, 0
    );
  }

  get total(): number {
    if (this.invoices.length === 0) {
      return 0;
    }

    const { invoice_price_gross } = this.invoices[0];
    return invoice_price_gross;
  }

  get totalPreview(): number {
    const total = this.servicesPreviewTotal + this.total;
    return total + (total * taxInPercentage);
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly servicesService: ServiceService,
    private readonly roomsService: RoomService,
    protected readonly authService: AuthService,
    private readonly reservationsService: ReservationService,
    private readonly notificationsService: NotificationsService,
    private readonly datePipe: DatePipe,
    protected readonly customersService: CustomerService,
    private readonly router: RouterExtendedService,
    private readonly invoicesService: InvoiceService,
    private readonly loadingService: LoadingService,
    private readonly confirmationDialogService: ConfirmationDialogService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (isNaN(params['reservation_id']) === false) {
        this.reservation_id = +params['reservation_id'];
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getData();
  }

  async getData(): Promise<void> {
    try {
      /**
       * Calling methods order matters!
       * First we need to get reservation entries
       * in order to get `customer_id`!
       */
      await this.getAvailableServices();
      await this.getReservationRooms();
      await this.getReservationServices();
      await this.getReservationInvoiceEntries();
      await this.getCustomer();
    } catch (e) {
      console.error(e);
    }
  }

  async getCustomer(): Promise<void> {
    const customer_id = this.reservations[0].reservation_customer_id;
    this.customer = await this.customersService.getById(customer_id);
  }

  async getReservationRooms(): Promise<void> {
    this.reservations = await this.reservationsService.getById(this.reservation_id);
    if (this.reservations.length === 0) {
      this.router.router.navigate(['/rooms']);
      return;
    }

    this.start_date = new Date(this.reservations[0].reservation_start_date);
    this.end_date = new Date(this.reservations[0].reservation_end_date);

    if (
      this.reservations.some(r => r.reservation_status_id < ReservationStatus.CONFIRMED)
      && new Date() <= this.start_date
    ) {
      this.disableEdit = false;
    }

    const rooms_ids = this.reservations.map(({ reservation_room_id }) => reservation_room_id);
    for (const room_id of rooms_ids) {
      const room = await this.roomsService.getById(room_id);
      this.rooms.push(room);
    }
  }

  async getReservationServices(): Promise<void> {
    this.reservationServices = await this.reservationsService.getReservationServices(this.reservation_id);
    this.reservationServices.forEach(({ service_id, service_price, service_quantity }) => {
      const index = this.availableServices.findIndex(s => s.service_id === service_id);
      if (index !== -1) {
        this.availableServices[index] = {
          ...this.availableServices[index],
          service_quantity,
          service_price,
        }
      }
    });
  }

  async getReservationInvoiceEntries(): Promise<void> {
    this.invoices = await this.invoicesService.getInvoiceEntriesByReservationId(this.reservation_id);
  }

  async getAvailableServices(): Promise<void> {
    this.loadingService.show();

    try {
      this.availableServices = await this.servicesService.get();
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async cancelReservation(): Promise<void> {
    if (
      await this.confirmationDialogService.confirmDelete(
        'Caution!',
        'Are you sure you want to cancel reservation?',
        'Cancel'
      ) === false
    ) {
      return;
    }

    this.loadingService.show();

    try {
      await this.reservationsService.delete(this.reservation_id);
      this.notificationsService.success('Success', 'Reservation cancelled successfully', BaseService.notificationOverride);
      this.router.router.navigate(['/rooms']);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async saveReservationServices(): Promise<void> {
    this.loadingService.show();

    try {
      await this.removeServiceFromReservation();
      await this.addServicesToReservation();

      this.reservationServices = this.availableServices.filter(({ service_quantity }) => service_quantity > 0);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async downloadReservation(): Promise<void> {
    this.loadingService.show();

    try {
      await this.invoicesService.generateByReservationId(this.reservation_id);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }


  async saveReservation(): Promise<void> {
    this.loadingService.show();

    try {
      const chosenStatus = ReservationStatus.CONFIRMED;

      await this.reservationsService.update({
        ...this.reservations[0],
        reservation_start_date: this.parsed_start_date,
        reservation_end_date: this.parsed_end_date,
        reservation_status_id: chosenStatus, // TODO: List of statuses set by admin
      });

      this.reservations[0].reservation_status_id = chosenStatus;

      this.notificationsService.success('Success', 'Reservation saved succesfully', BaseService.notificationOverride);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async payReservation(): Promise<void> {
    this.loadingService.show();

    try {
      await this.saveReservationServices();

      await this.reservationsService.update({
        ...this.reservations[0],
        reservation_start_date: this.parsed_start_date,
        reservation_end_date: this.parsed_end_date,
        reservation_status_id: ReservationStatus.WAITING_PAYMENT,
      });

      this.reservations[0].reservation_status_id = ReservationStatus.WAITING_PAYMENT;

      this.notificationsService.success('Success', 'We have sent you a confirmation e-mail', BaseService.notificationOverride);
    } catch (e) {
      console.error(e);
    }

    this.loadingService.hide();
  }

  async addServicesToReservation(): Promise<void> {
    const filledServices = this.availableServices.filter(({ service_quantity }) => service_quantity > 0);
    for (let service of filledServices) {
      service = {
        ...service,
        service_reservation_id: this.reservation_id,
        service_last_modified_by: this.customer.customer_id,
        service_last_modified_at: new Date(),
      } satisfies Service;

      await this.reservationsService.addService(service);
    }
  }

  async removeServiceFromReservation(): Promise<void> {
    for (const { service_id } of this.reservationServices) {
      await this.reservationsService.removeServiceFromReservation(this.reservation_id, service_id);
    }
  }

  async roomFromReservationRemoved(room: Room): Promise<void> {
    if (
      await this.confirmationDialogService.confirmDelete(
        'Caution!',
        'Are you sure you want to remove room from the reservation?',
        'Remove',
      ) === false
    ) {
      return;
    }

    try {
      await this.reservationsService.removeRoomFromReservation(this.reservation_id, room.room_id);
      this.reservations = this.reservations.filter(({ reservation_room_id }) => room.room_id !== reservation_room_id);
      this.rooms = this.rooms.filter(({ room_id }) => room_id !== room.room_id);
      await this.getReservationInvoiceEntries();

      this.notificationsService.success('Success', 'Room removed successfully from the reservation', BaseService.notificationOverride);
      if (this.rooms.length === 0) {
        this.router.router.navigate(['/rooms']);
      }
    } catch (e) {
      console.error(e);
    }
  }

  onQuantityChange({ target }: Event, service_id: number): void {
    const quantity = (target as HTMLInputElement).valueAsNumber;
    const index = this.availableServices.findIndex(s => s.service_id === service_id);
    if (index !== -1) {
      this.availableServices[index].service_quantity = isNaN(quantity) ? 0 : quantity;
    }
  }

  onRemoveServiceButtonClicked(service_id: number): void {
    const index = this.availableServices.findIndex(s => s.service_id === service_id);
    if (index !== -1) {
      this.availableServices[index].service_quantity = 0;
    }
  }

}
