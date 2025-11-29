
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  template: `
    <header style="padding: 1rem; border-bottom: 1px solid #ddd; display:flex; gap:1rem; align-items:center;">
      <span style="font-weight:bold;">FreshCart Admin</span>
      <a routerLink="/admin-sign-in">Sign In</a>
      <a routerLink="/admin-sign-up">Sign Up</a>
      <a routerLink="/dashboard">Dashboard</a>
    </header>

    <main style="padding: 1rem;">
      <router-outlet></router-outlet>
    </main>
  `,
})
export class App {}
