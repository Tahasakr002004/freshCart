// Handles admin login/register + token
// ===============================================
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of, tap, catchError, map } from 'rxjs';

export interface AdminInfo {
  id?: number | string;
  adminName: string;
}

export interface AdminRegisterDto {
  adminName: string;
  adminPassword: string;
}

export interface AdminLoginDto {
  adminName: string;
  adminPassword: string;
}

// <-- NEW: model the login response properly
interface AdminLoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly baseUrl = `${environment.apiBaseUrl}/admin`;
  private readonly tokenKey = 'adminToken';

  // signal holds ONLY the raw JWT string or null
  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentAdmin = signal<AdminInfo | null>(null);

  constructor(private http: HttpClient) {}

  register(dto: AdminRegisterDto): Observable<string> {
    return this.http
      .post(`${this.baseUrl}/registeradmin`, dto, { responseType: 'text' })
      .pipe(
        catchError(err => {
          console.error('[AdminAuthService] register error:', err);
          throw err;
        })
      );
  }

  // IMPORTANT: Treat response as JSON, not plain text
  login(dto: AdminLoginDto): Observable<AdminLoginResponse> {
    return this.http
      .post<AdminLoginResponse>(`${this.baseUrl}/loginadmin`, dto)
      .pipe(
        tap(res => {
          console.log('[AdminAuthService] login response:', res);
          // store ONLY the JWT string
          this.setToken(res.token);
        }),
        catchError(err => {
          console.error('[AdminAuthService] login error:', err);
          throw err;
        })
      );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
    this.currentAdmin.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  loadAdminInfo(): Observable<AdminInfo | null> {
    if (!this.token()) {
      return of(null);
    }

    return this.http.get<{ message: string }>(`${this.baseUrl}/dashboard`).pipe(
      map(res => {
        const adminName = res.message
          ?.replace('Welcome to dashboard for', '')
          .trim();
        const info: AdminInfo = { adminName };
        this.currentAdmin.set(info);
        return info;
      }),
      catchError(err => {
        console.error('[AdminAuthService] loadAdminInfo error:', err);
        this.logout();
        return of(null);
      })
    );
  }

  private setToken(token: string): void {
    if (token?.trim()) {
      console.log('[AdminAuthService] storing token:', token);
      localStorage.setItem(this.tokenKey, token); // <-- raw JWT
      this.token.set(token);
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);   // <-- raw JWT
  }
}
