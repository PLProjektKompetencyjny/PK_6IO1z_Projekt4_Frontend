import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { Reservation, ReservationStatus } from '../../modules/reservations/components/reservation-edit/reservation.model';
import { ApiResponse } from '../api-response.model';
import { environment } from '../../../environments/environment';
import { Service } from '../../modules/services/service.model';

@Injectable({
  providedIn: 'root',
})
export class ReservationService extends BaseService {

  readonly baseReservationsPath: string = 'reservations';
  readonly baseServicesPath: string = 'services';

  constructor(
    private readonly httpClient: HttpClient,
    protected override readonly notificationsService: NotificationsService,
  ) {
    super(notificationsService);
  }

  async get(filters?: {
    reservation_customer_id?: number | string,
    reservation_status_id?: ReservationStatus | string,
    reservation_start_date?: Date | string,
    reservation_end_date?: Date | string,
  }): Promise<Reservation[]> {
    const params = this.generateParams(filters);
    const request = this.httpClient.get<Reservation>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      { params }
    ).pipe(catchError<Reservation, ObservableInput<ApiResponse<Reservation>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request) as ApiResponse<Reservation>;
    const reservations = response.data;

    return reservations;
  }

  async getById(reservation_id: number): Promise<Reservation[]> {
    const params = this.generateParams({ reservation_id });
    const request = this.httpClient.get<Reservation>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      { params }
    ).pipe(catchError<Reservation, ObservableInput<ApiResponse<Reservation>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request) as ApiResponse<Reservation>;
    const reservations = response.data;

    return reservations;
  }

  async create(reservation: Reservation): Promise<number> {
    const formData = this.getFormData(reservation);

    const request = this.httpClient.post<Reservation>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      formData
    ).pipe(catchError<Reservation, ObservableInput<ApiResponse<Reservation>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request) as ApiResponse<Reservation>;
    const { reservation_id } = response.data[0];

    return reservation_id;
  }

  async update(reservation: Reservation): Promise<void> {
    const formData = this.getFormData(reservation);

    const request = this.httpClient.put<Reservation>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      formData
    ).pipe(catchError<Reservation, ObservableInput<ApiResponse<Reservation>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  async delete(reservation_id: number): Promise<void> {
    const reservationEntries = await this.getById(reservation_id);
    for (const { reservation_room_id } of reservationEntries) {
      const formData = this.getFormData({ reservation_id, reservation_room_id });

      const request = this.httpClient.delete<void>(
        `${environment.apiUrl}/${this.baseReservationsPath}`,
        { body: formData }
      ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

      await firstValueFrom(request);
    }
  }

  async addService(service: Service): Promise<void> {
    const formData = this.getFormData(service);

    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseServicesPath}`,
      formData
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  async getReservationServices(reservation_id: number): Promise<Service[]> {
    const params = this.generateParams({ service_reservation_id: reservation_id });
    const request = this.httpClient.get<Service>(
      `${environment.apiUrl}/${this.baseServicesPath}`,
      { params }
    ).pipe(catchError<Service, ObservableInput<ApiResponse<Service>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request) as ApiResponse<Service>;
    const reservationServices = response.data;

    return reservationServices;
  }

  async removeRoomFromReservation(reservation_id: number, reservation_room_id: number): Promise<void> {
    const formData = this.getFormData({ reservation_id, reservation_room_id });

    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      { body: formData }
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  async removeServiceFromReservation(service_reservation_id: number, service_id: number): Promise<void> {
    const formData = this.getFormData({ service_reservation_id, service_id });

    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.baseServicesPath}`,
      { body: formData }
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

}
