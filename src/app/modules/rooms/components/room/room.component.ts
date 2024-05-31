import { Component, Input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Room } from '../room-edit/room.model';
import { AuthService } from '../../../../services/auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'tn-room',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  @Input() room!: Room;

  constructor(
    protected readonly authService: AuthService,
  ) { }
}
