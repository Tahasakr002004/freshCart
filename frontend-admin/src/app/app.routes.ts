import { Routes } from '@angular/router';
import { AdminSignIn } from './admin-sign-in/admin-sign-in';
import { AdminSignUp } from './admin-sign-up/admin-sign-up';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { adminAuthGuard } from './guards/admin-auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'admin-sign-in', pathMatch: 'full' },
  { path: 'admin-sign-in', component: AdminSignIn },
  { path: 'admin-sign-up', component: AdminSignUp },
  { path: 'dashboard', component: AdminDashboard, canActivate: [adminAuthGuard] },
  { path: '**', redirectTo: 'admin-sign-in' },
];
