import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { appName } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly title = appName;
}
