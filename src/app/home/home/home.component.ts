import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { HeaderComponent } from '../../shared/components/header/header.component';

import { appName, owlOptions } from './home.config';

@Component({
  selector: 'tn-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  imports: [HeaderComponent, RouterLink, CarouselModule]
})
export class HomeComponent {
  protected readonly appName = appName;
  protected readonly owlOptions = owlOptions;
}
