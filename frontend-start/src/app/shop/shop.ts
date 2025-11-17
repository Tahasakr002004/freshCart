import { Component, OnInit, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';
import { ProductCard } from '../product-card/product-card';

@Component({
  selector: 'app-shop',
  imports: [ProductCard],
  templateUrl: './shop.html',
  styleUrl: './shop.css'
})
export class Shop implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal('');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (p) => {
        this.products.set(p);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error.set('Failed to load products');
        this.loading.set(false);
      }
    });
  }
}
