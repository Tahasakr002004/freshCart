// src/app/shop/shop.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './shop.html',
  styleUrls: ['./shop.css'],
})
export class Shop implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
  this.loading.set(true);
  this.error.set('');

  this.productService.getProducts().subscribe({
    next: (res: any) => {
      console.log('[Shop] getProducts response:', res);
      this.products.set(res.data ?? []); // ⬅ use res.data
      this.loading.set(false);
    },
    error: (err) => {
      console.error('Failed to load products', err);
      this.error.set('Failed to load products');
      this.loading.set(false);
    },
  });
 }
}
