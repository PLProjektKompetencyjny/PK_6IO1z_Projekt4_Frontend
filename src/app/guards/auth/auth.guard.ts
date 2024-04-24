import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RouterExtendedService } from '../../services/router-extended/router-extended.service';

export const authGuard: CanActivateFn = (route, state) => {
  return handleAuth(route, state);
};

function handleAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const auth = inject(AuthService);
  const routerExtended = inject(RouterExtendedService);

  if (auth.isAuthenticated) {
    return true;
  }

  routerExtended.navigateToSignIn(state.url);
  return false;
}
