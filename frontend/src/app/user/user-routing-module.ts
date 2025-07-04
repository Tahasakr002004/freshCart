import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Profile } from './profile/profile';
import { Cart } from './cart/cart';
import { Checkout } from './checkout/checkout';
import { UserLogin } from './user-login/user-login';
import { UserRegister } from './user-register/user-register';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'login', component: UserLogin },
  { path: 'register', component: UserRegister },
  { path: 'profile', component: Profile },
  { path: 'cart', component: Cart },
  { path: 'checkout', component: Checkout },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
