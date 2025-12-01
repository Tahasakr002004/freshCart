// src/app/nav-bar/nav-bar.ts
import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.html',   // <-- WICHTIG: nur noch nav-bar.html
})
export class NavBar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);

  constructor() {
    effect(() => {
      const token = this.auth.token();
      if (token) {
        this.cart.loadCart();
      } else {
        this.cart.cart.set(null);
      }
    });
  }

  cartCount = computed(
    () => this.cart.cart()?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0
  );

  get isLoggedIn(): boolean {
    return !!this.auth.token();
    // alternativ: return this.auth.isAuthenticated();
  }

  get user() {
    return this.auth.currentUser();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
