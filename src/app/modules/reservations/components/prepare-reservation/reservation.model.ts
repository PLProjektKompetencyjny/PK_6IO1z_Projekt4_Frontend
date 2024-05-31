export type Reservation = {
  reservation_id: number;
  reservation_customer_id: number;
  reservation_status_id: ReservationStatus;
  reservation_number_of_adults: number;
  reservation_number_of_children: number;
  reservation_start_date: Date;
  reservation_end_date: Date;
  reservation_room_id: number;
  reservation_room_status_id: ReservationRoomStatus;
  reservation_last_modified_by?: number;
  reservation_last_modified_at?: Date;
}

export enum ReservationStatus {
  WAITING_CONFIRMATION = 1,
  WAITING_PAYMENT = 2,
  CONFIRMED = 3,
  CANCELLED = 4,
  CHECKED_IN = 5,
  CHECKED_OUT = 6,
  NO_SHOW = 7,
}

export enum ReservationRoomStatus {
  RESERVED = 1,
  CONFIRMED = 2,
  CANCELLED = 3,
}