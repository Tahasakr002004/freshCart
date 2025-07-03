import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing-module';
import { Customer } from './customer';
import { Login } from './login/login';
import { Profile } from './profile/profile';


@NgModule({
  declarations: [
    Customer,
    Login,
    Profile
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
