import { BaseModel } from '../../../../shared/models/base.model';

export type Room = BaseModel & {
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