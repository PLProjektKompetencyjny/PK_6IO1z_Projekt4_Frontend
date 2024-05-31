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

@Component({
  selector: 'tn-prepare-reservation',
  templateUrl: './prepare-reservation.component.html',
  styleUrl: './prepare-reservation.component.scss'
})
export class PrepareReservationComponent implements OnInit {
  room!: Room;
  room_id!: number;
  servicesMgmt: ServiceMgmt[] = [];
  checkedServiceMgmt: CheckedServiceMgmt[] = [];
  start_date: Date = new Date();
  end_date: Date = new Date();
  reservation!: Reservation;

  get servicesTotal(): number {
    return this.checkedServiceMgmt.reduce((partialSum: number, { unit_price, quantity }): number =>
      partialSum + unit_price * quantity, 0
    );
  }

  get total(): number {
    return this.room.room_gross_price + this.servicesTotal;
  }

  constructor(
    private readonly route: ActivatedRoute,
    private readonly servicesService: ServiceService,
    private readonly roomsService: RoomService,
    private readonly authService: AuthService,
    private readonly reservationsService: ReservationService,
    private readonly notificationsService: NotificationsService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (isNaN(params['room_id']) === false) {
        this.room_id = +params['room_id'];
      }

      this.start_date = new Date(JSON.parse(params['start_date']));
      this.end_date = new Date(JSON.parse(params['end_date']));
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getRoom();
    await this.getServices();
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

  async createReservation(): Promise<void> {
    if (this.validate() === false) {
      return;
    }

    try {
      this.reservation = {
        reservation_id: 0,
        reservation_customer_id: this.authService.session?.user_id ?? 0,
        reservation_status_id: ReservationStatus.WAITING_CONFIRMATION,
        reservation_number_of_adults: this.room.room_number_of_single_beds + this.room.room_number_of_double_beds * 2,
        reservation_number_of_children: this.room.room_number_of_child_beds,
        reservation_start_date: this.start_date,
        reservation_end_date: this.end_date,
        reservation_room_id: this.room.room_id,
        reservation_room_status_id: ReservationRoomStatus.RESERVED,
        reservation_last_modified_by: this.authService.session?.user_id ?? 0,
        reservation_last_modified_at: new Date()
      } satisfies Reservation;

      this.reservation.reservation_id = await this.reservationsService.create(this.reservation);
      await this.addServicesToReservation();

      this.notificationsService.success('Success', 'Reservation created. We have sent you an e-mail with confimation details');
    } catch (e) {
      console.error(e);
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

  validate(): boolean {
    if (this.checkedServiceMgmt.some(s => !s.quantity)) {
      this.notificationsService.error('Error', 'Enter quantity for each checked additional services');
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
