import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, ObservableInput, catchError, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RouterExtendedService } from '../router-extended/router-extended.service';
import { Session } from '../../shared/models/session.model';
import { Customer } from '../../modules/profile/customer.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BaseService } from '../base.service';
import { NotificationsService } from 'angular2-notifications';
import { ApiResponse } from '../api-response.model';

/**
 * Service for authentication purposes
 * e.g. HTTP requests to sign in/up
 * or manage session with local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseService {

  /**
   * The base path to authorization endpoints.
   */
  readonly baseAuthPath: string = 'auth';

  /**
   * The base path to user related endpoints.
   */
  readonly baseUsersPath: string = 'users';

  /**
   * Local storage key to the session data.
   */
  static readonly localStorageSessionKey: string = 'session';

  /**
   * Checks whether use is authenticated or not.
   */
  get isAuthenticated(): boolean {
    return this.session !== undefined;
  }

  /**
   * Checks whether token is expired.
   */
  get isTokenExpired(): boolean {
    if (this.isAuthenticated) {
      return this.jwtHelperService.isTokenExpired(this.session?.access_token ?? '');
    }

    return false;
  }

  /**
   * Provides {@link Session} if exists.
   */
  get session(): Session | undefined {
    const session = localStorage.getItem(AuthService.localStorageSessionKey) ?? '';
    if (session) {
      return JSON.parse(session) as Session;
    }

    return undefined;
  }

  /**
   * Credentials to authenticate a user with a server.
   */
  get authorizationHeaderValue(): string {
    if (this.session) {
      return `${this.session?.auth_schema} ${this.session?.access_token}`;
    }

    return '';
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly routerExtended: RouterExtendedService,
    private readonly jwtHelperService: JwtHelperService,
    protected readonly notificationService: NotificationsService,
  ) {
    super(notificationService);
  }

  /**
   * Logs in the user to the application.
   * @param email User's e-mail.
   * @param password User's password.
   */
  async signIn(email: string, password: string): Promise<void> {
    const request = this.httpClient.post<Session>(
      `${environment.apiUrl}/${this.baseAuthPath}/sign-in`,
      { email, password }
    ).pipe(catchError<unknown, ObservableInput<ApiResponse<unknown>>>(this.catchCustomError.bind(this)));

    await this.handleAuthRequest(request as Observable<Session>);
  }

  /**
   * Signs up new user to the application.
   * @param newUser New user's {@link Customer}.
   */
  async signUp(newUser: Customer): Promise<void> {
    const request = this.httpClient.post<Session>(
      `${environment.apiUrl}/${this.baseAuthPath}/sign-up`,
      { ...newUser }
    );

    await this.handleAuthRequest(request as Observable<Session>);
  }

  /**
   * Updates logged user's password.
   * @param user_new_password User's new password.
   */
  async updatePassword(user_email: string, user_old_password: string, user_new_password: string): Promise<void> {
    const formData = this.getFormData({
      login: user_email,
      new_user_password: user_new_password,
      old_user_password: user_old_password,
      customer_last_modified_by: this.session?.user_id ?? 0,
    });
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.baseUsersPath}`,
      formData
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  /**
   * Updates NOT logged user's password which is identified by {@link user_reset_password_code}.
   * @param user_reset_password_code User's reset password code by which he is identified.
   * @param user_new_password User's new password.
   */
  async resetPassword(user_reset_password_code: string, user_new_password: string): Promise<void> {
    const body = { user_reset_password_code, new_password: user_new_password };
    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseAuthPath}/password/change`,
      body
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  /**
   * Makes a request to the API which sends a reset confirmation link to the user to the mail.
   * @param user_email User's email.
   */
  async resetPasswordMailRequest(user_email: string): Promise<void> {
    const body = { email: user_email };
    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseAuthPath}/password/reset`,
      body
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  /**
   * Makes a request to activate a user.
   * @param user_activation_code User's activation code by which is identified.
   */
  async activate(user_activation_code: string): Promise<void> {
    const body = { user_activation_code };
    const request = this.httpClient.post<void>(
      `${environment.apiUrl}/${this.baseAuthPath}/activate`,
      body
    ).pipe(catchError<void, ObservableInput<ApiResponse<void>>>(this.catchCustomError.bind(this)))

    await firstValueFrom(request);
  }

  /**
   * Used for handling auth related reqeusts.
   * @param request The auth related request.
   */
  private async handleAuthRequest(request: Observable<Session>): Promise<void> {
    const session = await firstValueFrom(request);
    this.saveSession(session);

    this.routerExtended.navigateToPreviousUrl();
  }

  /**
   * Signs out user.
   */
  signOut(): void {
    this.clearSession();
    this.routerExtended.navigateToHome();
  }

  /**
   * Saves {@link Session} to the local storage.
   * @param session The {@link Session} data to save in the local storage.
   */
  private saveSession(session: Session): void {
    localStorage.setItem(AuthService.localStorageSessionKey, JSON.stringify(session));
  }

  /**
   * Clears out all user related session data.
   */
  clearSession(): void {
    localStorage.removeItem(AuthService.localStorageSessionKey);
  }
}
