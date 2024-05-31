import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Room, RoomStatus } from '../room-edit/room.model';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'tn-room',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  protected readonly RoomStatus = RoomStatus;

  @Input() room!: Room;
  @Input() start_date: Date = new Date();
  @Input() end_date: Date = new Date();

  constructor(
    protected readonly authService: AuthService,
  ) { }

  getJsonStartDate(): string {
    return JSON.stringify(this.start_date);
  }

  getJsonEndDate(): string {
    return JSON.stringify(this.end_date);
  }
}
