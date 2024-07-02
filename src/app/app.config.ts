import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SimpleNotificationsModule } from 'angular2-notifications';

import { routes } from './app.routes';
import { jwtInterceptor } from './interceptors/jwt/jwt.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    provideAnimations(),
    importProvidersFrom(
      SimpleNotificationsModule.forRoot()
    ),
  ]
};

export const appName: string = 'TravelNest';

export const dateFormats = {
  short: 'dd-MM-yyyy',
  long: 'dd-MM-yyyy HH:mm:ss'
}