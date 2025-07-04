import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing-module';
import { Shop } from './shop';
import { ProductList } from './product-list/product-list';
import { Cart } from '../user/cart/cart';


@NgModule({
  declarations: [
    Shop,
    ProductList,
    Cart
  ],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
