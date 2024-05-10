import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

/**
 * "Man-in-the-middle".
 * It is executed before an actual call to the API.
 * Here we attach additional metadata that will be sent to the api
 * e.g. modified header, body etc.
 * @param req {@link HttpRequest}
 * @param next {@link HttpHandlerFn}
 * @returns A function {@link HttpInterceptorFn} which handles requests to the API.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  return handleRequest(req, next);
};

function handleRequest(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const auth = inject(AuthService);
  if (auth.isAuthenticated) {
    req = req.clone({
      setHeaders: {
        Authorization: auth.authorizationHeaderValue
      }
    });
  }

  return next(req);
}
