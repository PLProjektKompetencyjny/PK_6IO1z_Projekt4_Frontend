import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../environments/environment';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { ApiResponse } from '../api-response.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseService {
  readonly baseInvoicesPath: string = 'Invoices';
  readonly baseServicesPath: string = 'services';

  constructor(
    private readonly httpClient: HttpClient,
    protected override readonly notificationsService: NotificationsService,
  ) {
    super(notificationsService);
  }

  // async createByReservation(reservation_id: number): Promise<number> {
  //   const formData = this.getFormData(invoice);

  //   const request = this.httpClient.post<Invoice>(
  //     `${environment.apiUrl}/${this.baseInvoicesPath}`,
  //     formData
  //   ).pipe(catchError<Invoice, ObservableInput<ApiResponse<Invoice>>>(this.catchCustomError.bind(this)))

  //   const response = await firstValueFrom(request) as ApiResponse<Invoice>;
  //   const { invoice_id } = response.data[0];

  //   return invoice_id;
  // }
}
