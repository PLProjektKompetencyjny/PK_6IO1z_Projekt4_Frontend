import { BaseModel } from '../../../../shared/models/base.model';

export type Room = BaseModel & {
  room_id: number;
  room_type_id: number;
  room_status_id: number;
  room_number_of_single_beds: number;
  room_number_of_double_beds: number;
  room_number_of_child_beds: number;
  room_gross_price: number;
  room_gross_price_adult: number;
  room_gross_price_child: number;
  room_photos_dir: string;
}