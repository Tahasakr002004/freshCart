import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLogin } from './admin-login/admin-login';
import { AdminRegister } from './admin-register/admin-register';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { ProductEdit } from './product-edit/product-edit';
import { AddProduct } from './add-product/add-product';
import { adminGuard } from '../guards/admin-guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: AdminLogin },
  { path: 'register', component: AdminRegister },
  { path: 'dashboard', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'add-product', component: AddProduct, canActivate: [adminGuard] },
  { path: 'product-edit', component: ProductEdit, canActivate: [adminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
