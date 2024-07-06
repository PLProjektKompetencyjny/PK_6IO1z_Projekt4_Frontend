export type Invoice = {
  invoice_id: number;
  invoice_reservation_id: number;
  invoice_room_id: number;
  invoice_room_price_gross: number;
  invoice_date: Date | string;
  invoice_price_gross: number;
  invoice_is_paid: boolean;
  invoice_status_id: number;
  invoice_last_modified_by: number;
  invoice_last_modified_at: Date | string;
}