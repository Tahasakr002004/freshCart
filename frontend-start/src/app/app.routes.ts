import { Routes } from '@angular/router';
import { SignIn } from './sign-in/sign-in';
import { SignUp } from './sign-up/sign-up';
import { Shop } from './shop/shop';
import { ProductOverview } from './product-overview/product-overview';

export const routes: Routes = [
  { path: '', redirectTo: 'sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: SignIn },
  { path: 'sign-up', component: SignUp },
  { path: 'shop', component: Shop },
  { path: 'product/:id', component: ProductOverview },
  { path: '**', redirectTo: 'dashboard' }
];
