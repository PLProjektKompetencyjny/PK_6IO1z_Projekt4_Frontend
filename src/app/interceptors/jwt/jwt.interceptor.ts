import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

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
