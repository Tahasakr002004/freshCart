import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Dashboard } from './dashboard/dashboard';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: '**', redirectTo: 'dashboard' }
];
