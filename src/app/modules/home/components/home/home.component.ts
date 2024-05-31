import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { appName, owlOptions } from './home.config';
import { Room } from '../../../rooms/components/room-edit/room.model';
import { RoomService } from '../../../../services/room/room.service';
import { RouterExtendedService } from '../../../../services/router-extended/router-extended.service';

@Component({
  selector: 'tn-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  form: FormGroup;

  rooms: Room[] = [];

  protected readonly appName = appName;
  protected readonly owlOptions = owlOptions;
  protected readonly now = new Date();

  constructor(
    private readonly roomService: RoomService,
    private readonly formBuilder: FormBuilder,
    private readonly routerExtended: RouterExtendedService,
  ) {
    this.form = this.formBuilder.group({
      start_date: [undefined],
      end_date: [undefined],
      number_of_double_beds: [undefined],
      number_of_single_beds: [undefined],
      number_of_child_beds: [undefined],
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getRooms();
  }

  async getRooms(): Promise<void> {
    try {
      const rooms = await this.roomService.get();
      this.rooms = rooms.slice(0, 3);
    } catch (e) {
      console.error(e);
    }
  }

  goToRoomsView(): void {
    const controlNames = Object.keys(this.form.controls);
    let controlValues = {};

    for (const controlName of controlNames) {
      controlValues = {
        ...controlValues,
        [controlName]: this.form.controls[controlName]?.value
      };
    }

    const queryParams = this.roomService.generateParams(controlValues);

    this.routerExtended.router.navigate(
      ['/rooms'],
      { queryParams }
    );
  }

}
