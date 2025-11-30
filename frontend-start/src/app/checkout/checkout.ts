import { Component, signal, inject, computed } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../services/order.service';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../services/cart.service';
import { CartItem } from '../models/cart.model';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private cartService = inject(CartService);

  form = this.fb.nonNullable.group({
    address: ['', [Validators.required, Validators.minLength(5)]],
  });

  submitting = signal(false);
  resultMessage = signal('');

  constructor() {
    this.orderService.loadOrders();
    this.cartService.loadCart();
  }

  cartItems = computed(() => this.cartService.cart()?.items ?? []);
  
  cartTotal = computed(() => this.cartService.cart()?.totalAmount ?? 0);

  canCheckout = computed(() => this.cartItems().length > 0 && !this.submitting());

  submit(): void {
    if (!this.canCheckout() || this.form.invalid) return;
    this.submitting.set(true);
    this.resultMessage.set('');
    const address = this.form.controls.address.value;
    this.orderService.checkout(address).subscribe({
      next: order => {
        this.resultMessage.set('Checkout successful. Order ID: ' + (order._id || '(pending)'));
        this.submitting.set(false);
        this.cartService.loadCart();
      },
      error: err => {
        console.error(err);
        this.resultMessage.set('Checkout failed.');
        this.submitting.set(false);
      }
    });
  }

  deleteItem(productId: string) {
    this.cartService.removeItem(productId).subscribe({
      next: res => {
        if (typeof res === 'string') {
          console.warn('[RemoveItem]', res);
        } else {
          this.cartService.cart.set(res as any);
        }
      },
      error: err => console.error('Remove from cart failed', err)
    });
  }
}