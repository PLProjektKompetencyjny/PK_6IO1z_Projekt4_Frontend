import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { RoomService } from '../../../../services/room/room.service';
import { Room } from '../room-edit/room.model';

@Component({
  selector: 'tn-rooms-registry',
  templateUrl: './rooms-registry.component.html',
  styleUrl: './rooms-registry.component.scss'
})
export class RoomsRegistryComponent implements OnInit {

  form: FormGroup;

  rooms: Room[] = [];

  protected readonly now = new Date();

  get start_date(): AbstractControl<Date, Date> | null {
    return this.form.get('start_date');
  }

  get end_date(): AbstractControl<Date, Date> | null {
    return this.form.get('end_date');
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
    private readonly formBuilder: FormBuilder,
    private readonly route: ActivatedRoute,
  ) {
    this.form = this.formBuilder.group({
      start_date: [undefined],
      end_date: [undefined],
      number_of_double_beds: [undefined],
      number_of_single_beds: [undefined],
      number_of_child_beds: [undefined],
    });

    this.applyQueryParams();
  }

  private applyQueryParams(): void {
    this.route.queryParams.subscribe((params: Params) => {
      for (const [key, value] of Object.entries(params)) {
        this.form.controls[key]?.setValue(value);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getRooms();
  }

  async getRooms(): Promise<void> {
    try {
      this.rooms = await this.roomsService.get({
        room_number_of_single_beds: this.number_of_single_beds?.value,
        room_number_of_double_beds: this.number_of_double_beds?.value,
        room_number_of_child_beds: this.number_of_child_beds?.value,
        room_reservation_start_date: this.start_date?.value,
        room_reservation_end_date: this.end_date?.value
      });
    } catch (e) {
      console.error(e);
    }
  }

}
