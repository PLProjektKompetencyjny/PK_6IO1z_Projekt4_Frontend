import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../../services/loading/loading.service';

@Component({
  selector: 'tn-loading',
  standalone: true,
  imports: [],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss'
})
export class LoadingComponent implements OnDestroy {

  loadingSubscription: Subscription;
  show: boolean = false;

  constructor(protected readonly loadingService: LoadingService) {
    this.loadingSubscription = this.loadingService.loadingObservable.subscribe((show) => {
      this.show = show;
    });
  }

  ngOnDestroy(): void {
    this.loadingSubscription?.unsubscribe();
  }

}
