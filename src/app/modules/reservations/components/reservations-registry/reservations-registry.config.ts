import { ReservationStatus, ReservationStatusLabels } from '../reservation-edit/reservation.model';

export const getReservationStatusLabel = (reservation_status_id: ReservationStatus): string => {
  return ReservationStatusLabels.get(reservation_status_id) ?? 'Unknown';
}