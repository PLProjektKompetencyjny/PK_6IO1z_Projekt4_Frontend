import { User } from './user.model';

/**
 * Represents session stored in the local storage.
 */
export type Session = User & {
  tokenType: string;
  accessToken: string;
}