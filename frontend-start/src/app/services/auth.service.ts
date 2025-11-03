import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface RegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = 'http://localhost:5000/user';
  // minimal auth state with signals
  token = signal<string | null>(this.getToken());

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.api}/register`, dto, { responseType: 'text' }).pipe(
      tap(token => this.setToken(token))
    );
  }

  login(dto: LoginDto): Observable<any> {
    return this.http.post(`${this.api}/login`, dto, { responseType: 'text' }).pipe(
      tap(token => this.setToken(token))
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.token.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private setToken(token: any) {
    if (typeof token === 'string' && token.trim().length > 0) {
      localStorage.setItem('token', token);
      this.token.set(token);
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }
}
