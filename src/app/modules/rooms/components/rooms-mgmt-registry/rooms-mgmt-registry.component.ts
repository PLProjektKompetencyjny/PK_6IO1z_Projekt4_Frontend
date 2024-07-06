import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { RoomService } from '../../../../services/room/room.service';
import { Room } from '../room-edit/room.model';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'tn-rooms-mgmt-registry',
  templateUrl: './rooms-mgmt-registry.component.html',
  styleUrl: './rooms-mgmt-registry.component.scss'
})
export class RoomsMgmtRegistryComponent implements OnInit {

  form: FormGroup;

  rooms: Room[] = [];

  get room_id(): AbstractControl<number, number> | null {
    return this.form.get('room_id');
  }

  get number_of_double_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_double_beds');
  }

  get number_of_single_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_single_beds');
  }

  get number_of_child_beds(): AbstractControl<number, number> | null {
    return this.form.get('number_of_child_beds');
  }

  constructor(
    private readonly roomsService: RoomService,
    protected readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
  ) {
    this.form = this.formBuilder.group({
      room_id: [undefined],
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
      this.rooms = await this.roomsService.get({
        room_id: this.room_id?.value,
        room_number_of_single_beds: this.number_of_single_beds?.value,
        room_number_of_double_beds: this.number_of_double_beds?.value,
        room_number_of_child_beds: this.number_of_child_beds?.value,
      });
    } catch (e) {
      console.error(e);
    }
  }

  clearFilters(): void {
    this.form.reset();
  }

}
