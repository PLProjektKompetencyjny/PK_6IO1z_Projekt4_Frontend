import { User } from '../../modules/profile/user.model';

/**
 * Represents session stored in the local storage.
 */
export type Session = User & {
  authScheme: string;
  accessToken: string;
}