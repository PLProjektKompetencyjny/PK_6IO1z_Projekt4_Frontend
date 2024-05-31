import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { Room } from '../../modules/rooms/components/room-edit/room.model';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../api-response.model';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends BaseService {

  readonly basePath: string = 'rooms';

  constructor(
    private readonly httpClient: HttpClient,
    protected override readonly notificationsService: NotificationsService,
  ) {
    super(notificationsService);
  }

  /**
   * Gets specific room by {@link id}.
   * @param id An ID of the {@link Room} in a database.
   * @returns A {@link Room}'s data.
   */
  async getById(room_id: number): Promise<Room> {
    const params = this.generateParams({ room_id });
    const request = this.httpClient.get<ApiResponse<Room>>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    ).pipe(catchError<ApiResponse<Room>, ObservableInput<ApiResponse<Room>>>(this.catchCustomError.bind(this)));

    const { data } = await firstValueFrom(request);
    return data[0];
  }

  /**
   * Gets a list of hotel rooms.
   * @param filters Filters to be applied
   * @returns List of rooms in the hotel.
   */
  async get(filters?: {
    room_status_id?: number | undefined,
    room_number_of_single_beds?: number | undefined,
    room_number_of_double_beds?: number | undefined,
    room_number_of_child_beds?: number | undefined,
    room_reservation_start_date?: Date | undefined,
    room_reservation_end_date?: Date | undefined
  }): Promise<Room[]> {
    const params = this.generateParams(filters);
    const request = this.httpClient.get<ApiResponse<Room>>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    ).pipe(catchError<ApiResponse<Room>, ObservableInput<ApiResponse<Room>>>(this.catchCustomError.bind(this)));

    const response = await firstValueFrom(request);
    return response?.data ?? [];
  }

  /**
   * Updates existing room.
   * @param room A room to update.
   */
  async update(room: Room): Promise<void> {
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}`,
      room
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

}
