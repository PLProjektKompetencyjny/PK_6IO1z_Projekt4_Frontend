import { User } from './user.model';

/**
 * Represents session stored in the local storage.
 */
export type Session = User & {
  authScheme: string;
  accessToken: string;
}