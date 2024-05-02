import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, firstValueFrom } from 'rxjs';
import { User } from '../../modules/profile/user.model';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';

/**
 * Service related to HTTP request on `user`
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {

  /**
   * The base path to user endpoints.
   */
  readonly basePath: string = 'users';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly authService: AuthService,
  ) { }

  /**
   * Gets logged user's data.
   * @returns Logged {@link User}'s data.
   */
  async me(): Promise<User> {
    const request = this.httpClient.get<User>(
      `${environment.apiUrl}/${this.basePath}/me`
    )

    return await firstValueFrom(request);
  }

  /**
   * Gets user with specific id.
   * @param userId User's id in the database.
   * @returns User's data.
   */
  async getById(userId: string): Promise<User> {
    const request = this.httpClient.get<User>(
      `${environment.apiUrl}/${this.basePath}/${userId}`
    )

    return await firstValueFrom(request);
  }

  /**
   * Gets users with specific data.
   * @returns List of users.
   */
  async get(filters: {
    email: '',
    nip: '',
    firstname: '',
    surname: '',
    city: ''
  }): Promise<User[]> {
    const params = new HttpParams()
      .set('email', filters.email)
      .set('nip', filters.nip)
      .set('firstname', filters.firstname)
      .set('surname', filters.surname)
      .set('city', filters.city);

    const request = this.httpClient.get<User[]>(
      `${environment.apiUrl}/${this.basePath}`,
      { params }
    )

    return await firstValueFrom(request);
  }

  /**
   * Used for creating new user.
   * @param user New user's data.
   * @returns Created user's id.
   */
  async create(user: User): Promise<string> {
    const request = this.httpClient.post<string>(
      `${environment.apiUrl}/${this.basePath}`,
      user
    )

    return await firstValueFrom(request);
  }

  /**
   * Updates user's data.
   * @param user User's data to update.
   */
  async update(user: User): Promise<void> {
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}/${user.id}`,
      user
    );

    await firstValueFrom(request);
  }

  /**
   * Updates user's.
   * @param user User's data to update.
   */
  async delete(userId: string): Promise<void> {
    const request = this.httpClient.delete<void>(
      `${environment.apiUrl}/${this.basePath}/${userId}`
    );

    await firstValueFrom(request);
  }

  /**
   * Updates logged user's password.
   * @param password User's new password.
   */
  async updatePassword(password: string): Promise<void> {
    const userId = this.authService.session?.id;
    const request = this.httpClient.put<void>(
      `${environment.apiUrl}/${this.basePath}/${userId}/password`,
      { password }
    )

    await firstValueFrom(request);
  }
}
