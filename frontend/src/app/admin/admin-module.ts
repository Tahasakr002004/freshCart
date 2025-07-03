import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { ProductEdit } from './product-edit/product-edit';


@NgModule({
  declarations: [
    Admin,
    Login,
    Dashboard,
    ProductEdit
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
