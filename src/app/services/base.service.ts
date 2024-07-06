import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { ObservableInput, throwError } from 'rxjs';
import { ApiResponse, CodeMessage } from './api-response.model';

@Injectable({
  providedIn: 'root'
})
export class BaseService {

  static readonly notificationOverride = {
    timeOut: 4000,
  };

  readonly defaultError = {
    title: 'Error',
    message: 'Unknown error occurred. Refresh page and try again.'
  };

  constructor(protected readonly notificationsService: NotificationsService) { }

  generateParams(filters?: unknown): HttpParams {
    let params = new HttpParams();

    if (!filters) {
      return params;
    }

    for (const [name, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        if (value instanceof Array) {
          value.forEach(v => {
            params = params.append(name, v);
          });
        } else {
          params = params.set(name, value as string | number | boolean);
        }
      }
    }

    return params;
  }

  catchCustomError<TResult>(error: HttpErrorResponse): ObservableInput<ApiResponse<TResult>> {
    const codeMessage: CodeMessage = (error.error as ApiResponse<TResult>).code_message;
    const title = codeMessage?.type ?? this.defaultError.title;
    const message = codeMessage?.message ?? this.defaultError.message;
    this.notificationsService.error(title, message, BaseService.notificationOverride);

    return throwError(() => new Error(message));
  }

  getFormData(data?: unknown): FormData {
    const formData = new FormData();

    if (!data) {
      return formData;
    }

    for (const [name, value] of Object.entries(data)) {
      formData.append(name, `${value}`);
    }

    return formData;
  }

}
