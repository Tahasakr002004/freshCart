// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { Dashboard } from './dashboard/dashboard';
import { Shop } from './shop/shop';
import { ProductOverview } from './product-overview/product-overview';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // Standard-Redirect: Root -> Shop
  { path: '', redirectTo: 'shop', pathMatch: 'full' },

  // Auth-Seiten 
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },

  // Geschützte Seiten
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'shop', component: Shop, canActivate: [authGuard] },
  { path: 'product/:id', component: ProductOverview, canActivate: [authGuard] },

  // Fallback
  { path: '**', redirectTo: 'shop' },
];
