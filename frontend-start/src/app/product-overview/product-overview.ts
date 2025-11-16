import { Component, Input, OnInit } from '@angular/core';
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
  @Input() product!: Product; // if provided from a parent, it will be used
  loading = true;
  error = '';

  constructor(private route: ActivatedRoute, private productService: ProductService) {}

  ngOnInit(): void {
    // If product not provided via @Input, fetch it via route
    if (!this.product) {
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (!id) {
          this.error = 'Invalid product id';
          this.loading = false;
          return;
        }
        this.loading = true;
        this.productService.getProduct(id).subscribe({
          next: (p) => {
            this.product = p;
            this.loading = false;
          },
          error: (err) => {
            console.error('Failed to load product', err);
            this.error = 'Failed to load product';
            this.loading = false;
          }
        });
      });
    } else {
      this.loading = false;
    }
  }
}
