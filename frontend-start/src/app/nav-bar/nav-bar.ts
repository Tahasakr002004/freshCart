// src/app/nav-bar/nav-bar.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './nav-bar.component.html',
})
export class NavBar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

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
