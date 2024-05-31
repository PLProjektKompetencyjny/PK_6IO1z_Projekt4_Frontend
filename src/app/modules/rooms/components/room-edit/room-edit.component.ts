import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Room, RoomMgmt, RoomStatusesMap, RoomTypeMgmt } from './room.model';
import { RoomService } from '../../../../services/room/room.service';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'tn-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.scss'
})
export class RoomEditComponent implements OnInit {
  room!: Room;
  room_id: number = 0;

  protected readonly roomStatusesMap = RoomStatusesMap;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly roomsService: RoomService,
    private readonly routerExtended: RouterExtendedService,
    private readonly authService: AuthService,
  ) {
    this.route.params.subscribe((params: Params) => {
      if (isNaN(params['room_id'])) {
        this.routerExtended.navigateToPreviousUrl();
      }

      this.room_id = +params['room_id'];
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getRoom();
  }

  async getRoom(): Promise<void> {
    try {
      this.room = await this.roomsService.getById(this.room_id);
    } catch (e) {
      console.error(e);
    }
  }

  async save(): Promise<void> {
    try {
      await this.saveRoomMgmt();
      await this.saveRoomTypeMgmt();
    } catch (e) {
      console.error(e);
    }
  }

  async saveRoomMgmt(): Promise<void> {
    const roomMgmt = {
      id: this.room.room_id,
      room_type_id: this.room.room_type_id,
      room_status_id: this.room.room_status_id,
      room_gross_price: this.room.room_gross_price,
    } satisfies RoomMgmt;

    await this.roomsService.updateRoomMgmt(roomMgmt);
  }

  async saveRoomTypeMgmt(): Promise<void> {
    const roomTypeMgmt = {
      id: this.room.room_type_id,
      num_of_single_beds: this.room.room_number_of_single_beds,
      num_of_double_beds: this.room.room_number_of_double_beds,
      num_of_child_beds: this.room.room_number_of_child_beds,
      adult_price_gross: this.room.room_gross_price_adult,
      child_price_gross: this.room.room_gross_price_child,
    } satisfies RoomTypeMgmt;

    await this.roomsService.updateRoomTypeMgmt(roomTypeMgmt);
  }

}
