import { Component, Input, inject, signal } from '@angular/core';
import { Product } from '../models/product.model';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCard {
  @Input() product!: Product;
  private cart = inject(CartService);

  adding = signal(false);
  feedback = signal('');

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

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.product?._id || this.product.stock <= 0) return;

    this.adding.set(true);
    this.feedback.set('');

    this.cart.addItem(this.product._id, 1).subscribe({
      next: (res) => {
        this.feedback.set(typeof res === 'string' ? res : 'Zum Warenkorb hinzugefügt');
        this.adding.set(false);
        setTimeout(() => this.feedback.set(''), 2000);
      },
      error: (err) => {
        console.error('Add to cart failed', err);
        this.feedback.set(err?.status === 401 ? 'Bitte zuerst einloggen' : 'Konnte nicht hinzufügen');
        this.adding.set(false);
        setTimeout(() => this.feedback.set(''), 2500);
      }
    });
  }
}
