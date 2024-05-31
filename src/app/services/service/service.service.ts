import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { ApiResponse } from '../api-response.model';
import { ServiceMgmt } from '../../modules/services/service.model';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../environments/environment';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService extends BaseService {

  readonly baseMgmtPath: string = 'admin/service';

  constructor(
    private readonly httpClient: HttpClient,
    protected override readonly notificationsService: NotificationsService,
  ) {
    super(notificationsService);
  }

  async get(filters?: {
    id?: number | undefined,
    name?: string | undefined,
    unit_price?: number | undefined
  }): Promise<ServiceMgmt[]> {
    const params = this.generateParams(filters);
    const request = this.httpClient.get<ApiResponse<ServiceMgmt>>(
      `${environment.apiUrl}/${this.baseMgmtPath}`,
      { params }
    ).pipe(catchError<ApiResponse<ServiceMgmt>, ObservableInput<ApiResponse<ServiceMgmt>>>(this.catchCustomError.bind(this)));

    const response = await firstValueFrom(request);
    return response?.data ?? [];
  }

  async getById(id: number): Promise<ServiceMgmt> {
    const params = this.generateParams({ id });
    const request = this.httpClient.get<ApiResponse<ServiceMgmt>>(
      `${environment.apiUrl}/${this.baseMgmtPath}`,
      { params }
    ).pipe(catchError<ApiResponse<ServiceMgmt>, ObservableInput<ApiResponse<ServiceMgmt>>>(this.catchCustomError.bind(this)));

    const response = await firstValueFrom(request);
    return response?.data[0];
  }

  async create(serviceMgmt: ServiceMgmt): Promise<void> {
    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseMgmtPath}`,
      serviceMgmt
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  async update(serviceMgmt: ServiceMgmt): Promise<void> {
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.baseMgmtPath}`,
      serviceMgmt
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  async delete(id: number): Promise<void> {
    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.baseMgmtPath}/${id}`
    ).pipe(catchError<void, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }
}
