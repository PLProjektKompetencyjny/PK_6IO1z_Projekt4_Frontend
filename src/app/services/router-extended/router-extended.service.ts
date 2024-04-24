import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouterExtendedService {

  /**
   * Local storage key to the previous url.
   */
  static readonly localStoragePreviousUrlKey: string = 'previous-url';

  /**
   * The path to the home page.
   */
  readonly homeUrl: string = '/';

  /**
   * The path to the sign in page.
   */
  readonly signInUrl: string = '/sign-in';

  /**
   * Sets from local storage identified by the key {@link localStoragePreviousUrlKey}
   * previously visited url.
   */
  set previousUrl(value: string) {
    localStorage.setItem(RouterExtendedService.localStoragePreviousUrlKey, value);
  }

  /**
   * Gets from local storage identified by the key {@link localStoragePreviousUrlKey}
   * previously visited url.
   */
  get previousUrl(): string {
    return localStorage.getItem(RouterExtendedService.localStoragePreviousUrlKey) ?? this.homeUrl;
  }

  constructor(public readonly router: Router) { }

  /**
   * Navigates to the {@link homeUrl} page.
   */
  navigateToHome(): void {
    this.router.navigateByUrl(this.homeUrl);
  }

  /**
   * Navigates to the previously visited url/page.
   */
  navigateToPreviousUrl(): void {
    this.router.navigateByUrl(this.previousUrl);
  }

  /**
   * Navigates to sign in page.
   * @param returnUrl Url visited before redirect to {@link signInUrl}.
   */
  navigateToSignIn(returnUrl: string): void {
    this.previousUrl = returnUrl;
    this.router.navigateByUrl(this.signInUrl);
  }
}
