import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { Reservation } from '../../modules/reservations/components/prepare-reservation/reservation.model';
import { ApiResponse } from '../api-response.model';
import { environment } from '../../../environments/environment';
import { Service } from '../../modules/services/service.model';

@Injectable({
  providedIn: 'root'
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

  async create(reservation: Reservation): Promise<number> {
    const request = this.httpClient.post<number>(
      `${environment.apiUrl}/${this.baseReservationsPath}`,
      reservation
    ).pipe(catchError<number, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    return await firstValueFrom(request) as number;
  }

  async addService(service: Service): Promise<void> {
    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseServicesPath}`,
      service
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

}
