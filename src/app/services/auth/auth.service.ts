import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { RouterExtendedService } from '../router-extended/router-extended.service';
import { Session } from '../../shared/models/session.model';

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
    return this.session !== null;
  }

  /**
   * Provides {@link Session} if exists.
   */
  get session(): Session | null {
    const session = localStorage.getItem(AuthService.localStorageSessionKey) ?? '';
    return JSON.parse(session) as Session;
  }

  /**
   * Provides {@link Session.accessToken} from the {@link session}.
   */
  get accessToken(): string {
    return this.session?.accessToken ?? '';
  }

  /**
   * Provides {@link Session.authScheme} from the {@link session}.
   */
  get authScheme(): string {
    return this.session?.authScheme ?? '';
  }

  /**
   * Credentials to authenticate a user-agent with a server.
   */
  get authorizationHeaderValue(): string {
    return `${this.authScheme} ${this.accessToken}`;
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
   * @param email User's e-mail.
   * @param password User's password.
   * @param firstName User's firstname.
   * @param surname User's surname.
   */
  async signUp(email: string, password: string, firstname: string, surname: string): Promise<void> {
    const request = this.httpClient.post<Session>(
      `${environment.apiUrl}/${this.basePath}/sign-up`,
      { email, password, firstname, surname }
    );

    await this.handleAuthRequest(request);
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
