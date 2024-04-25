import { Component } from '@angular/core';
import { Views } from './profile.config';

@Component({
  selector: 'tn-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  protected readonly Views = Views;
  protected currentView: Views = Views.details;

  changeView(view: Views): void {
    this.currentView = view;
  }
}
