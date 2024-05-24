/**
 * Represents customer related data.
 */
export type Customer = {
  customer_id: number;
  customer_email: string;
  customer_is_admin: boolean;
  customer_name: string;
  customer_surname: string;
  customer_phone: string;
  customer_nip_number: string;
  customer_city: string;
  customer_postal_code: string;
  customer_street: string;
  customer_building_number: string;
  customer_password?: string;
  customer_last_modified_by?: number;
  customer_last_modified_at?: Date;
}
