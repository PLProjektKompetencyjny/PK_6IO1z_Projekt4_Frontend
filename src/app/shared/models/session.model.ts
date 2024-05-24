/**
 * Represents session stored in the local storage.
 */
export type Session = {
  auth_schema: string;
  access_token: string;
  user_id: number;
  email: string;
  is_admin: boolean;
}