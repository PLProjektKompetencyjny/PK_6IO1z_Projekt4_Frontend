import { Component, OnInit } from '@angular/core';
import { User } from '../../user.model';
import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'tn-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit {

  user: User = {
    id: '',
    email: '',
    isAdmin: false,
    firstname: '',
    surname: '',
    password: '',
    phone: '',
    nip: '',
    city: '',
    postalCode: '',
    street: '',
    buildingNumber: '',
  };

  constructor(private readonly userService: UserService) { }

  async ngOnInit(): Promise<void> {
    await this.getMe();
  }

  async getMe(): Promise<void> {
    try {
      this.user = await this.userService.getById('');
    } catch (e) {
      console.error(e);
    }
  }

  async update(): Promise<void> {
    try {
      await this.userService.update(this.user);
    } catch (e) {
      console.error(e);
    }
  }
}
