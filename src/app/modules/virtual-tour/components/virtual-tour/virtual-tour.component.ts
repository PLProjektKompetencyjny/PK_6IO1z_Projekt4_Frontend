import { Component } from '@angular/core';
import { appName, startRoomNo } from './virtual-tour.config';

@Component({
  selector: 'tn-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrl: './virtual-tour.component.scss'
})
export class VirtualTourComponent {
  protected readonly appName = appName;
  currentRoom = startRoomNo;

  nextRoom(): void {
    if (this.currentRoom === 3) {
      this.currentRoom = 1;
    } else {
      this.currentRoom += 1;
    }
  }

  previousRoom(): void {
    if (this.currentRoom === 1) {
      this.currentRoom = 3;
    } else {
      this.currentRoom -= 1;
    }
  }
}
