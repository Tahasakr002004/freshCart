import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem, Cart } from '../models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart_comp implements OnInit {
  private cartService = inject(CartService);

  loading = computed(() => this.cartService.loading());
  error = computed(() => this.cartService.error());
  cart = computed(() => this.cartService.cart());
  items = computed(() => this.cart()?.items ?? []);
  total = computed(() => this.cart()?.totalAmount ?? 0);

  message = signal('');

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  increase(item: CartItem) {
    this.adjustQuantity(item, item.quantity + 1);
  }

  decrease(item: CartItem) {
    const next = Math.max(1, item.quantity - 1);
    this.adjustQuantity(item, next);
  }

  onQuantityInput(item: CartItem, event: Event) {
    const value = Number((event.target as HTMLInputElement).value) || 1;
    this.adjustQuantity(item, value);
  }

  remove(item: CartItem) {
    this.cartService.removeItem(item.product).subscribe({
      next: (res) => this.handleResponse(res, 'Item removed'),
      error: (err) => this.handleError(err, 'Could not remove item'),
    });
  }

  clearCart() {
    this.cartService.clear().subscribe({
      next: (res) => this.handleResponse(res, 'Cart cleared'),
      error: (err) => this.handleError(err, 'Could not clear cart'),
    });
  }

  private adjustQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) quantity = 1;
    this.cartService.updateItem(item.product, quantity).subscribe({
      next: (res) => this.handleResponse(res, 'Quantity updated'),
      error: (err) => this.handleError(err, 'Could not update quantity'),
    });
  }

  private handleResponse(res: Cart | string, fallbackMessage: string) {
    if (typeof res === 'string') {
      this.message.set(res);
    } else {
      this.message.set(fallbackMessage);
    }
    setTimeout(() => this.message.set(''), 2000);
  }

  private handleError(err: any, fallback: string) {
    console.error(err);
    this.message.set(err?.status === 401 ? 'Please sign in' : fallback);
    setTimeout(() => this.message.set(''), 2500);
  }
}
