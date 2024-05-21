import { AfterViewInit, Component } from '@angular/core';
import { appName, startRoomNo } from './virtual-tour.config';

@Component({
  selector: 'tn-virtual-tour',
  templateUrl: './virtual-tour.component.html',
  styleUrl: './virtual-tour.component.scss'
})
export class VirtualTourComponent implements AfterViewInit {

  protected readonly appName = appName;
  currentRoom = startRoomNo;

  ngAfterViewInit(): void {
    const badLogo = document.querySelector('iframe .top-gui') as HTMLDivElement;
    badLogo.style.display = 'none';
  }

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
