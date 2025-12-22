import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/sign-in']);
    return of(false);
  }

  return auth.ensureIdentityLoaded().pipe(
    map((identity) => {
      if (identity) return true;
      router.navigate(['/sign-in']);
      return false;
    }),
    catchError((err) => {
      console.error('[authGuard] error:', err);
      auth.logout();
      router.navigate(['/sign-in']);
      return of(false);
    })
  );
};
