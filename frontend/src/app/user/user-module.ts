import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { User } from './user';
import { UserLogin } from './user-login/user-login';
import { Profile } from './profile/profile';
import { UserRegister } from './user-register/user-register';
import { Checkout } from './checkout/checkout';


@NgModule({
  declarations: [
    User,
    UserLogin,
    Profile,
    UserRegister,
    Checkout
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
