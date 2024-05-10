import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { RouterExtendedService } from '../../services/router-extended/router-extended.service';

/**
 * Preserve unauthorized user from entering admin views.
 * @param route {@link ActivatedRouteSnapshot}
 * @param state {@link RouterStateSnapshot}
 * @returns Authentication result - validating user's session & credentials.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  return handleAdminAuth(route, state);
};

function handleAdminAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const auth = inject(AuthService);
  const routerExtended = inject(RouterExtendedService);

  if (auth.isAuthenticated && auth.session?.isAdmin) {
    return true;
  }

  routerExtended.navigateToSignIn(state.url);
  return false;
}

