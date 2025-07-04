import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getRole(): 'admin' | 'user' | null {
    if (localStorage.getItem('adminToken')) return 'admin';
    if (localStorage.getItem('userToken')) return 'user';
    return null;
    
  }
  getUserToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isUserLoggedIn(): boolean {
    return !!this.getUserToken();
  }

  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('userToken');
  }
}
