import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { appName } from '../../../app.config';

@Component({
  selector: 'tn-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  protected readonly appName = appName;
}
