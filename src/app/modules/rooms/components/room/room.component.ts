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

  constructor(
    protected readonly authService: AuthService,
  ) { }
}
