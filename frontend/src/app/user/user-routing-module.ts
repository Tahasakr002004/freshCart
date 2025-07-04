import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { UserLogin } from './user-login/user-login';
import { UserRegister } from './user-register/user-register';
import { userGuard } from '../guards/user-guard';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'profile', component: Profile, canActivate: [userGuard] },
  { path: 'cart', component: Cart, canActivate: [userGuard] },
  { path: 'checkout', component: Checkout, canActivate: [userGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
