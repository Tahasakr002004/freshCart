import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing-module';
import { Admin } from './admin';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ProductEdit } from './product-edit/product-edit';
import { AdminRegister } from './admin-register/admin-register';


@NgModule({
  declarations: [
    Admin,
    AdminLogin,
    AdminDashboard,
    ProductEdit,
    AdminRegister
  ],
  imports: [
    CommonModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
