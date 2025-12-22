import { Component, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.html',
})
export class NavBar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cart = inject(CartService);

  constructor() {
    // ✅ only load cart if logged in as USER (prevents 403 for admin)
    effect(() => {
      const token = this.auth.token();
      const role = this.auth.role();

      if (token && role === 'user') {
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
  }

  get isUser(): boolean {
    return this.auth.role() === 'user';
  }

  get user() {
    return this.auth.currentUser();
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
