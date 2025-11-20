import { Component, Input } from '@angular/core';
import { Product } from '../models/product.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: Product;
  // Build correct image URL for backend
  get imageUrl(): string {
    const raw = this.product.imageUrl ?? '';

    // Case: '/public/freshcartImages/apple_2.jpg'
    if (raw.startsWith('/public/freshcartImages/')) {
      const fileName = raw.split('/').pop();
      return `http://localhost:5050/images/${fileName}`;
    }


    // Fallback: assume relative path served by backend
    return `http://localhost:5050${raw}`;
  }
}
