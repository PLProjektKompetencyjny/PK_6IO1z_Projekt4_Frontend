export type Room = {
  room_id: number;
  room_type_id: number;
  room_status_id: RoomStatus;
  room_number_of_single_beds: number;
  room_number_of_double_beds: number;
  room_number_of_child_beds: number;
  room_gross_price: number;
  room_gross_price_adult: number;
  room_gross_price_child: number;
  room_photos_dir: string;
  room_last_modified_by?: number;
  room_last_modified_at?: Date;
}

export type RoomTypeMgmt = {
  id: number;
  num_of_single_beds: number;
  num_of_double_beds: number;
  num_of_child_beds: number;
  adult_price_gross: number;
  child_price_gross: number;
  photos_dir: string;
  last_modified_by?: number;
  last_modified_at?: Date;
}

export type RoomMgmt = {
  id: number;
  room_type_id: number;
  status_id: RoomStatus;
  room_price_gross: number;
  last_modified_by?: number;
  last_modified_at?: Date;
}

export enum RoomStatus {
  AVAILABLE = 1,
  OCCUPIED = 2,
  RESERVED = 3,
  OUT_OF_ORDER = 4,
  MAINTENANCE = 5,
}

export const RoomStatusesMap = new Map<RoomStatus, string>([
  [RoomStatus.AVAILABLE, 'Available'],
  [RoomStatus.OCCUPIED, 'Occupied'],
  [RoomStatus.RESERVED, 'Reserved'],
  [RoomStatus.OUT_OF_ORDER, 'Out of order'],
  [RoomStatus.MAINTENANCE, 'Maintenance'],
]);
