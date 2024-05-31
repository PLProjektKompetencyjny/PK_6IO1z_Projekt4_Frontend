import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableInput, catchError, firstValueFrom } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Customer } from '../../modules/profile/customer.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { ApiResponse } from '../api-response.model';
import { BaseService } from '../base.service';

/**
 * Service related to HTTP request on `customer`
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService {

  /**
   * The base path to customer endpoints.
   */
  readonly basePath: string = 'customers';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
    protected override readonly notificationsService: NotificationsService
  ) {
    super(notificationsService);
  }

  /**
   * Gets logged customer's data.
   * @returns Logged {@link Customer}'s data.
   */
  async me(): Promise<Customer> {
    const userId = this.authService.session?.user_id ?? 0;
    const params = new HttpParams().set('customer_id', userId);
    const request = this.httpClient.get<ApiResponse<Customer>>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    ).pipe(catchError<ApiResponse<Customer>, ObservableInput<ApiResponse<Customer>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request);
    const customer = response.data[0];

    return customer;
  }

  /**
   * Gets customers with specific data.
   * @returns List of customers.
   */
  async get(filters: {
    customer_email: '',
    customer_nip_number: '',
    customer_name: '',
    customer_surname: '',
    customer_city: ''
  }): Promise<Customer[]> {
    const params = this.generateParams(filters);

    const request = this.httpClient.get<ApiResponse<Customer>>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    ).pipe(catchError<ApiResponse<Customer>, ObservableInput<ApiResponse<Customer>>>(this.catchCustomError.bind(this)))

    const { data } = await firstValueFrom(request);
    return data;
  }

  /**
   * Used for creating new customer.
   * @param newCustomer New customer's data.
   * @returns Created customer's id.
   */
  async create(newCustomer: Customer): Promise<number> {
    const request = this.httpClient.post<number>(
      `${environment.apiUrl}/${this.basePath}`,
      newCustomer
    ).pipe(catchError<number, ObservableInput<ApiResponse<number>>>(this.catchCustomError.bind(this)))

    return await firstValueFrom(request) as number;
  }

  /**
   * Updates customer's data.
   * @param customer Customer's data to update.
   */
  async update(customer: Customer): Promise<void> {
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}/${customer.customer_id}`,
      customer
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)));

    await firstValueFrom(request);
  }

  /**
   * Deletes customer with specific {@link customerId}.
   * @param customerId Customer's id in the database.
   */
  async delete(customerId: number): Promise<void> {
    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.basePath}/${customerId}`
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)));

    await firstValueFrom(request);
  }
}
