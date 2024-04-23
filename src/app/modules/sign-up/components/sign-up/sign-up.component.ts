import { Component } from '@angular/core';
import { appName } from './sign-up.config';

@Component({
  selector: 'tn-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
    protected readonly appName = appName;
}
