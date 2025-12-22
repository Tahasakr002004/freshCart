import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UserInfo } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  user: UserInfo | null = null;
  loading = true;

  ngOnInit(): void {
    // Beim Aufruf des Dashboards sicherstellen, dass der User geladen ist
  this.auth.ensureUserLoaded().subscribe((user: UserInfo | null) => {
      this.user = user;
      this.loading = false;

      // Falls kein User (z.B. abgelaufener Token) -> zurück zum Login
      if (!user) {
        this.router.navigate(['/sign-in']);
      }
    });
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/sign-in']);
  }
}
