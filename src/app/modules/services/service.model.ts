export type Service = {
  service_id: number;
  service_name: string;
  service_price: number;
  service_price_total: number;
  service_reservation_id: number;
  service_quantity: number;
  service_last_modified_by?: number;
  service_last_modified_at?: Date;
}

export type ServiceMgmt = {
  id: number;
  name: string;
  unit_price: number;
  last_modified_by?: number;
  last_modified_at?: Date;
}

export type CheckedServiceMgmt = ServiceMgmt & {
  quantity: number;
}