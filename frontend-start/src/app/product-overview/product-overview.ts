import { Component, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../models/product.model';
import { ProductService } from '../services/product.service';

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

  @Input('product') set productInput(value: Product | null | undefined) {
    if (value) {
      this.product.set(value);
      this.error.set('');
      this.loading.set(false);
    }
  }

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    if (!this.product()) {
      this.route.paramMap.subscribe((params) => {
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
          },
        });
      });
    } else {
      this.loading.set(false);
    }
  }

  // 🔽🔽🔽 ADD THESE SMALL GETTERS 🔽🔽🔽

  get name(): string {
    return this.product()?.name ?? '';
  }

  get imageUrl(): string {
    const raw = this.product()?.imageUrl ?? '';

    // If backend already sends a full URL, just use it
    if (/^https?:\/\//.test(raw)) {
      return raw;
    }

    // Case: '/images/apple_2.jpg'
    if (raw.startsWith('/images/')) {
      return `http://localhost:5050${raw}`;
    }

    // Case: '/public/freshcartImages/apple_2.jpg'
    if (raw.startsWith('/public/freshcartImages/')) {
      const fileName = raw.split('/').pop();
      return `http://localhost:5050/images/${fileName}`;
    }

    // Fallback: if something else, try backend root
    return raw ? `http://localhost:5050${raw}` : '';
  }
}
