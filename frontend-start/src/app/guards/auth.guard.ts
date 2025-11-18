// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Kein Token -> direkt zum Login
  if (!auth.token()) {
    router.navigate(['/sign-in']);
    return of(false);
  }

  // Token da -> versuchen, User zu verifizieren / zu laden
  return auth.ensureUserLoaded().pipe(
    map((user) => {
      if (user) {
        return true;
      }
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
