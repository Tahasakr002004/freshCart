// Protects /dashboard
// ===============================================
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AdminAuthService } from '../services/admin-auth.service';
import { of } from 'rxjs';

export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AdminAuthService);
  const router = inject(Router);

  if (!auth.isAuthenticated()) {
    router.navigate(['/admin-sign-in']);
    return of(false);
  }

  // could also call auth.loadAdminInfo() here if you want server-side verification
  return of(true);
};
