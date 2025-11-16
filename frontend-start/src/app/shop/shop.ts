import { Component, OnInit } from '@angular/core';
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
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (p) => {
        this.products = p;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.error = 'Failed to load products';
        this.loading = false;
      }
    });
  }
}
