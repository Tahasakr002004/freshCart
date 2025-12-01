// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { Dashboard } from './dashboard/dashboard';
import { Shop } from './shop/shop';
import { ProductOverview } from './product-overview/product-overview';
import { authGuard } from './guards/auth.guard';
import { Checkout } from './checkout/checkout';
import { Cart_comp } from './cart/cart';

export const routes: Routes = [
  // Standard-Redirect: Root -> Shop
  { path: '', redirectTo: 'shop', pathMatch: 'full' },

  // Auth-Seiten
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },

  // Geschützte Seiten
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  // { path: 'shop', component: Shop, canActivate: [authGuard] },
  { path: 'shop', component: Shop },
  { path: 'product/:id', component: ProductOverview, canActivate: [authGuard] },
  { path: 'cart', component: Cart_comp, canActivate: [authGuard] },
  { path: 'checkout', component: Checkout, canActivate: [authGuard] },

  // Fallback
  { path: '**', redirectTo: 'shop' },
];
