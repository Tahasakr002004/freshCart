import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cart, CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private http = inject(HttpClient);
  private baseUrl = '/cart';

  cart = signal<Cart | null>(null);
  loading = signal(false);
  error = signal('');

  loadCart() {
    this.loading.set(true);
    this.http.get<Cart>(this.baseUrl).subscribe({
      next: c => { this.cart.set(c); this.loading.set(false); },
      error: err => { console.error(err); this.error.set('Failed loading cart'); this.loading.set(false); }
    });
  }

  addItem(productId: string, quantity: number) {
    return this.http.post<Cart | string>(`${this.baseUrl}/items`, { productId, quantity });
  }

  updateItem(productId: string, quantity: number) {
    return this.http.put<Cart | string>(`${this.baseUrl}/items`, { productId, quantity });
  }

  removeItem(productId: string) {
    return this.http.delete<Cart | string>(`${this.baseUrl}/items/${productId}`);
  }

  clear() {
    return this.http.delete<Cart | string>(this.baseUrl);
  }
}