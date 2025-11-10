import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, map } from 'rxjs';

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

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Backend-Port ggf. anpassen (5050 wenn Docker)
  private readonly api = 'http://localhost:5050/user';
  private readonly tokenKey = 'token';

  token = signal<string | null>(this.getToken());
  currentUser = signal<UserInfo | null>(null);

  constructor(private http: HttpClient) {
    const token = this.getToken();
    if (token) {
      this.verify().subscribe({
        next: () => {},
        error: () => {
          this.logout();
        },
      });
    }
  }

  register(dto: RegisterDto): Observable<any> {
    return this.http
      .post(`${this.api}/register`, dto, { responseType: 'text' })
      .pipe(tap((token) => this.setToken(token as string)));
  }

  login(dto: LoginDto): Observable<any> {
    return this.http
      .post(`${this.api}/login`, dto, { responseType: 'text' })
      .pipe(tap((token) => this.setToken(token as string)));
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.token.set(null);
    this.currentUser.set(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string) {
    if (typeof token === 'string' && token.trim().length > 0) {
      localStorage.setItem(this.tokenKey, token);
      this.token.set(token);
    }
  }

  /** Prüft, ob Token gültig ist & User existiert */
  verify(): Observable<UserInfo> {
    return this.http.get<{ data: UserInfo }>(`${this.api}/verify`).pipe(
      tap((res) => {
        this.currentUser.set(res.data);
      }),
      map((res) => res.data), // Typ-Korrektur
      catchError((err) => throwError(() => err)),
    );
  }
}
