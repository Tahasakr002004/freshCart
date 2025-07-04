import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing-module';
import { User } from './user';
import { Login } from './login/login';
import { Profile } from './profile/profile';


@NgModule({
  declarations: [
    User,
    Login,
    Profile
  ],
  imports: [
    CommonModule,
    UserRoutingModule
  ]
})
export class UserModule { }
