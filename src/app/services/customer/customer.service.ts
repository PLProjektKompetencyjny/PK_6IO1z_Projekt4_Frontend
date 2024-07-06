import { HttpClient } from '@angular/common/http';
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
    const params = this.generateParams({ customer_id: userId });
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
  async get(filters?: {
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
   * Gets logged customer's data.
   * @returns Logged {@link Customer}'s data.
   */
  async getById(customer_id: number): Promise<Customer> {
    const params = this.generateParams({ customer_id });
    const request = this.httpClient.get<ApiResponse<Customer>>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    ).pipe(catchError<ApiResponse<Customer>, ObservableInput<ApiResponse<Customer>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request);
    const customer = response.data[0];

    return customer;
  }

  /**
   * Used for creating new customer.
   * @param newCustomer New customer's data.
   * @returns Created customer's id.
   */
  async create(newCustomer: Customer): Promise<number> {
    const formData = this.getFormData(newCustomer);
    const request = this.httpClient.post<Customer>(
      `${environment.apiUrl}/${this.basePath}`,
      formData
    ).pipe(catchError<Customer, ObservableInput<ApiResponse<Customer>>>(this.catchCustomError.bind(this)))

    const response = await firstValueFrom(request) as ApiResponse<Customer>;
    const { customer_id } = response.data[0];

    return customer_id;
  }

  /**
   * Updates customer's data.
   * @param customer Customer's data to update.
   */
  async update(customer: Customer): Promise<void> {
    const formData = this.getFormData(customer);
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}`,
      formData
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)));

    await firstValueFrom(request);
  }

  /**
   * Deletes customer with specific {@link customerId}.
   * @param customerId Customer's id in the database.
   */
  async delete(customerId: number): Promise<void> {
    const body = { customerId };
    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.basePath}`,
      { body }
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)));

    await firstValueFrom(request);
  }

  display(customer: Customer): string {
    if (!customer) {
      return '';
    }

    return `(${customer.customer_email} ${customer.customer_phone}) ${customer.customer_name} ${customer.customer_surname}`;
  }
}
