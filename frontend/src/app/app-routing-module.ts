import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'admin', loadChildren: () => import('./admin/admin-module').then(m => m.AdminModule) }, { path: 'user', loadChildren: () => import('./customer/customer-module').then(m => m.CustomerModule) }, { path: 'shop', loadChildren: () => import('./shop/shop-module').then(m => m.ShopModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
