import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken(): string | null {
    return localStorage.getItem('userToken') || localStorage.getItem('adminToken');
  }

  getRole(): 'admin' | 'user' | null {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('userToken')) return 'user';
    return null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
  }
}
