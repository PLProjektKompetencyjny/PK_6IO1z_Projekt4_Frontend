import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private readonly loading$: Subject<boolean> = new Subject<boolean>();
  get loadingObservable(): Observable<boolean> {
    return this.loading$.asObservable();
  }

  show(): void {
    this.loading$.next(true);
  }

  hide(): void {
    this.loading$.next(false);
  }
}
