import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Room, RoomStatus } from '../room-edit/room.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { Reservation, ReservationRoomStatus, ReservationStatus } from '../../../reservations/components/reservation-edit/reservation.model';
import { dateFormats } from '../../../../app.config';
import { BaseService } from '../../../../services/base.service';
import { ReservationService } from '../../../../services/reservation/reservation.service';
import { NotificationsService } from 'angular2-notifications';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';

@Component({
  selector: 'tn-room',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
  providers: [DatePipe],
})
export class RoomComponent {
  protected readonly RoomStatus = RoomStatus;

  @Input() room!: Room;
  @Output() roomBooked: EventEmitter<Reservation> = new EventEmitter<Reservation>();
  @Output() roomFromReservationRemoved: EventEmitter<Room> = new EventEmitter<Room>();
  @Input() start_date: Date = new Date();
  @Input() end_date: Date = new Date();
  @Input() showDeleteFromReservationButton: boolean = false;
  @Input() showAddToReservationButton: boolean = true;
  @Input() isReservationEditView: boolean = false;

  private _customer_id: number = this.authService.session?.user_id ?? 0;

  /**
   * Who is the owner of the reservation.
   */
  @Input() set customer_id(value: number) {
    this._customer_id = value;
  }

  get customer_id(): number {
    return this._customer_id;
  }

  constructor(
    protected readonly authService: AuthService,
    private readonly reservationsService: ReservationService,
    private readonly notificationsService: NotificationsService,
    private readonly datePipe: DatePipe,
    private readonly router: RouterExtendedService,
  ) { }

  getJsonStartDate(): string {
    return JSON.stringify(this.start_date);
  }

  getJsonEndDate(): string {
    return JSON.stringify(this.end_date);
  }

  async bookRoom(): Promise<void> {
    if (!this.authService.session) {
      this.router.router.navigate(['/sign-up']);
    }

    if (this.validate() === false) {
      return;
    }

    try {
      const reservation = {
        reservation_id: 0,
        reservation_customer_id: this.customer_id,
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

      /**
       * When create (HTTP POST) called with the same start_date, end_date & customer_id
       * then room will be added to the reservation.
       */
      reservation.reservation_id = await this.reservationsService.create(reservation);

      this.notificationsService.success('Success', 'Room added to reservation', BaseService.notificationOverride);

      this.roomBooked.emit(reservation);
    } catch (e) {
      console.error(e);
    }
  }

  removeRoomFromReservation(): void {
    if (confirm('Are you sure you want to delete room from the reservation? Operation is unrecoverable') === false) {
      return;
    }

    this.roomFromReservationRemoved.emit(this.room);
  }

  validate(): boolean {
    if (!this.customer_id) {
      this.notificationsService.error('Error', 'Specify customer', BaseService.notificationOverride);
      return false;
    }

    return true;
  }
}
