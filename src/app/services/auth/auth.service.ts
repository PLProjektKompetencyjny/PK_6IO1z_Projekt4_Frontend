import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RouterExtendedService } from '../router-extended/router-extended.service';
import { Session } from '../../shared/models/session.model';
import { Customer } from '../../modules/profile/customer.model';

/**
 * Service for authentication purposes
 * e.g. HTTP requests to sign in/up
 * or manage session with local storage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * The base path to authorization endpoints.
   */
  readonly basePath: string = 'auth';

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
    return `${this.session?.auth_schema} ${this.session?.access_token}`;
  }

  constructor(
    private readonly httpClient: HttpClient,
    private readonly routerExtended: RouterExtendedService,
  ) { }

  /**
   * Logs in the user to the application.
   * @param email User's e-mail.
   * @param password User's password.
   */
  async signIn(email: string, password: string): Promise<void> {
    const request = this.httpClient.post<Session>(
      `${environment.apiUrl}/${this.basePath}/sign-in`,
      { email, password }
    );

    await this.handleAuthRequest(request);
  }

  /**
   * Signs up new user to the application.
   * @param newUser New user's {@link Customer}.
   */
  async signUp(newUser: Customer): Promise<void> {
    const request = this.httpClient.post<Session>(
      `${environment.apiUrl}/${this.basePath}/sign-up`,
      { ...newUser }
    );

    await this.handleAuthRequest(request);
  }

  /**
   * Updates logged user's password.
   * @param password User's new password.
   */
  async updatePassword(password: string): Promise<void> {
    const userId = this.session?.user_id;
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}/password`,
      {
        user_id: userId,
        password
      }
    )

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
   * Sings out user.
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
