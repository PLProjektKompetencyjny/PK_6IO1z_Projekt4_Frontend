import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotificationsService } from 'angular2-notifications';
import { environment } from '../../../environments/environment';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { taxInPercentage } from '../../app.config';
import { Invoice } from '../../shared/models/invoice.model';
import { ApiResponse } from '../api-response.model';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends BaseService {
  readonly baseInvoicesGeneratePath: string = 'invoice/generate'
  readonly baseInvoicesPath: string = 'invoices';

  constructor(
    private readonly httpClient: HttpClient,
    protected override readonly notificationsService: NotificationsService,
  ) {
    super(notificationsService);
  }

  async generateByReservationId(reservation_id: number): Promise<void> {
    const params = this.generateParams({ reservation_id, tax: taxInPercentage * 100 })
    const headers = new HttpHeaders().set('Accept', 'application/pdf');
    const request = this.httpClient.get<unknown>(
      `${environment.apiUrl}/${this.baseInvoicesGeneratePath}`,
      { headers, params, responseType: 'blob' as 'json' }
    ).pipe(catchError<unknown, ObservableInput<unknown>>(this.catchCustomError.bind(this)));

    const blob = await firstValueFrom(request) as Blob;
    const file = new Blob([blob], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank', 'width=1000, height=800');
  }

  async getInvoiceEntriesByReservationId(invoice_reservation_id: number): Promise<Invoice[]> {
    const params = this.generateParams({ invoice_reservation_id });

    const request = this.httpClient.get<ApiResponse<Invoice>>(
      `${environment.apiUrl}/${this.baseInvoicesPath}`,
      { params }
    ).pipe(catchError<ApiResponse<Invoice>, ObservableInput<ApiResponse<Invoice>>>(this.catchCustomError.bind(this)))

    const { data } = await firstValueFrom(request);
    return data;
  }
}
