import { Component, Input } from '@angular/core';
import { Room } from '../room-edit/room.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'tn-room',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss',
})
export class RoomComponent {
  @Input() room!: Room;
}
