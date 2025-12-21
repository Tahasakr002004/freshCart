// src/app/services/auth.service.ts
import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';

export interface UserInfo {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
}

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

/**
 * Backend liefert bei /user/verify:
 * { user: { id, firstName, lastName, email } }
 */
export interface VerifyResponse {
  user: UserInfo;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = '/user';

  readonly token = signal<string | null>(this.getStoredToken());
  readonly currentUser = signal<UserInfo | null>(null);

  constructor(private http: HttpClient) {
    // Beim App-Start: wenn Token existiert, User vom Backend nachladen
    if (this.token()) {
      this.verify().subscribe();
    }
  }

  // -------- API-Calls ----------

  register(dto: RegisterDto): Observable<string> {
    return this.http.post(`${this.baseUrl}/register`, dto, {
      responseType: 'text',
    }).pipe(
      tap((token) => this.setToken(token)),
      tap(() => this.verify().subscribe())
    ) as Observable<string>;
  }

  login(dto: LoginDto): Observable<string> {
    return this.http
      .post(`${this.baseUrl}/login`, dto, { responseType: 'text' })
      .pipe(
        tap((token) => this.setToken(token)),
        tap(() => this.verify().subscribe())
      ) as Observable<string>;
  }

  /**
   * Ruft /user/verify auf, aktualisiert currentUser
   * und gibt User oder null zurück.
   */
  verify(): Observable<UserInfo | null> {
    const t = this.token();
    if (!t) {
      return of(null);
    }

    return this.http.get<VerifyResponse>(`${this.baseUrl}/verify`).pipe(
      tap((res) => {
        // Backend: { user: {...} }
        this.currentUser.set(res.user);
      }),
      map((res) => res.user),
      catchError((err) => {
        console.error('[AuthService] verify error:', err);
        // Sicherheitshalber bei kaputtem Token ausloggen
        this.logout();
        return of(null);
      })
    );
  }

  /**
   * Helper für Guards:
   * - wenn currentUser schon gesetzt -> direkt zurück
   * - sonst verify() ausführen
   */
  ensureUserLoaded(): Observable<UserInfo | null> {
    const user = this.currentUser();
    if (user) {
      return of(user);
    }
    return this.verify();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.token.set(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  // -------- Helpers ----------

  private setToken(token: string): void {
    if (token?.trim()) {
      localStorage.setItem('token', token);
      this.token.set(token);
    }
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('token');
  }
}
