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
    // Load cart for signed-in shoppers (user/admin).
    effect(() => {
      const token = this.auth.token();
      const role = this.auth.role();

      if (token && (role === 'user' || role === 'admin')) {
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

  get isAdmin(): boolean {
    return this.auth.role() === 'admin';
  }

  get isShopper(): boolean {
    return this.isUser || this.isAdmin;
  }

  get displayName(): string | null {
    if (this.isUser) {
      const user = this.auth.currentUser();
      if (!user) return null;
      return `${user.firstName} ${user.lastName}`.trim();
    }

    if (this.isAdmin) {
      const admin = this.auth.currentAdmin();
      if (!admin?.adminName) return 'Admin (admin)';
      return `${admin.adminName} (admin)`;
    }

    return null;
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
