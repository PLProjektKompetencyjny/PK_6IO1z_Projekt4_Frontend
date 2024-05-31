import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Room, RoomStatusesMap } from './room.model';
import { RoomService } from '../../../../services/room/room.service';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';

@Component({
  selector: 'tn-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.scss'
})
export class RoomEditComponent implements OnInit {
  room!: Room;
  id: number = 0;

  protected readonly roomStatusesMap = RoomStatusesMap;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomsService: RoomService,
    private readonly routerExtended: RouterExtendedService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (isNaN(params['id'])) {
        this.routerExtended.navigateToPreviousUrl();
      }

      this.id = +params['id'];
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getRoom();
  }

  async getRoom(): Promise<void> {
    try {
      this.room = await this.roomsService.getById(this.id);
      console.log('this.room', this.room);
    } catch (e) {
      console.error(e);
    }
  }

  async save(): Promise<void> {
    try {
      await this.roomsService.update(this.room);
    } catch (e) {
      console.error(e);
    }
  }

}
