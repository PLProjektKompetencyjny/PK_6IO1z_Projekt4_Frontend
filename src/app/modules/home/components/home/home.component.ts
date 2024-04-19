import { Component } from '@angular/core';

import { appName, owlOptions } from './home.config';

@Component({
  selector: 'tn-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  protected readonly appName = appName;
  protected readonly owlOptions = owlOptions;
}
