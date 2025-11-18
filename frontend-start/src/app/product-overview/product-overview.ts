import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product';

@Component({
  selector: 'app-product-overview',
  imports: [],
  templateUrl: './product-overview.html',
  styleUrl: './product-overview.css'
})
export class ProductOverview implements OnInit {
  // Signals
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal('');

  // Accept optional product from parent and write to signal
  @Input('product') set productInput(value: Product | null | undefined) {
    if (value) {
      this.product.set(value);
      this.error.set('');
      this.loading.set(false);
    }
  }

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    // If product not provided via @Input, fetch it via route
    if (!this.product()) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) {
          this.error.set('Invalid product id');
          this.loading.set(false);
          return;
        }
        this.loading.set(true);
        this.productService.getProduct(id).subscribe({
          next: (p) => {
            this.product.set(p);
            this.loading.set(false);
          },
          error: (err) => {
            console.error('Failed to load product', err);
            this.error.set('Failed to load product');
            this.loading.set(false);
          }
        });
      });
    } else {
      this.loading.set(false);
    }
  }
}
