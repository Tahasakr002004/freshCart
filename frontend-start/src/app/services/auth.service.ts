import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, of, catchError, map } from 'rxjs';

export interface UserInfo {
  id?: string | number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AdminInfo {
  adminId?: string | number;
  adminName: string;
}

export type Role = 'user' | 'admin';

export type Identity =
  | { role: 'user'; user: UserInfo }
  | { role: 'admin'; admin: AdminInfo };

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

export interface AdminLoginDto {
  adminName: string;
  adminPassword: string;
}

/** Backend /user/verify -> { user: { ... } } */
export interface VerifyResponse {
  user: UserInfo;
}

/** Backend /admin/dashboard -> { message: "Welcome to dashboard for  <name>" } */
export interface AdminDashboardResponse {
  message: string;
}

/** Backend /admin/loginadmin -> { token: "<jwt>" } */
export interface AdminLoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userBaseUrl = '/user';
  private readonly adminBaseUrl = '/admin';

  private readonly tokenKey = 'token';
  private readonly roleKey = 'role'; // 'user' | 'admin'

  readonly token = signal<string | null>(this.getStoredToken());
  readonly role = signal<Role>(this.getStoredRole() ?? 'user');

  readonly currentUser = signal<UserInfo | null>(null);
  readonly currentAdmin = signal<AdminInfo | null>(null);
  readonly identity = signal<Identity | null>(null);

  constructor(private http: HttpClient) {
    // App start: if token exists, load identity (user OR admin)
    if (this.token()) {
      this.ensureIdentityLoaded().subscribe();
    }
  }

  // ---------------- USER AUTH ----------------

  register(dto: RegisterDto): Observable<string> {
    // returns token as TEXT
    return this.http
      .post(`${this.userBaseUrl}/register`, dto, { responseType: 'text' })
      .pipe(
        tap((token) => this.setSession(token, 'user')),
        tap(() => this.ensureIdentityLoaded().subscribe())
      ) as Observable<string>;
  }

  // keep old name for compatibility
  login(dto: LoginDto): Observable<string> {
    return this.loginUser(dto);
  }

  loginUser(dto: LoginDto): Observable<string> {
    return this.http
      .post(`${this.userBaseUrl}/login`, dto, { responseType: 'text' })
      .pipe(
        tap((token) => this.setSession(token, 'user')),
        tap(() => this.ensureIdentityLoaded().subscribe())
      ) as Observable<string>;
  }

  verifyUser(): Observable<UserInfo | null> {
    const t = this.token();
    if (!t) return of(null);

    return this.http.get<VerifyResponse>(`${this.userBaseUrl}/verify`).pipe(
      tap((res) => {
        this.currentUser.set(res.user);
        this.currentAdmin.set(null);

        this.identity.set({ role: 'user', user: res.user });
        this.role.set('user');
        this.storeRole('user');
      }),
      map((res) => res.user),
      catchError((err) => {
        console.error('[AuthService] verifyUser error:', err);
        this.logout();
        return of(null);
      })
    );
  }

  // ---------------- ADMIN AUTH (SHOP LOGIN MODE) ----------------

  loginAdmin(dto: AdminLoginDto): Observable<AdminLoginResponse> {
    return this.http
      .post<AdminLoginResponse>(`${this.adminBaseUrl}/loginadmin`, dto)
      .pipe(
        tap((res) => this.setSession(res.token, 'admin')),
        tap(() => this.ensureIdentityLoaded().subscribe())
      );
  }

  verifyAdmin(): Observable<AdminInfo | null> {
    const t = this.token();
    if (!t) return of(null);

    return this.http.get<AdminDashboardResponse>(`${this.adminBaseUrl}/dashboard`).pipe(
      map((res) => {
        const adminName =
          res.message?.replace('Welcome to dashboard for', '').trim() || 'Admin';

        const info: AdminInfo = { adminName };

        this.currentAdmin.set(info);
        this.currentUser.set(null);

        this.identity.set({ role: 'admin', admin: info });
        this.role.set('admin');
        this.storeRole('admin');

        return info;
      }),
      catchError((err) => {
        console.error('[AuthService] verifyAdmin error:', err);
        this.logout();
        return of(null);
      })
    );
  }

  // ---------------- SHARED HELPERS ----------------

  ensureIdentityLoaded(): Observable<Identity | null> {
    if (!this.token()) return of(null);

    const existing = this.identity();
    if (existing) return of(existing);

    const role = this.getStoredRole() ?? this.role() ?? 'user';

    if (role === 'admin') {
      return this.verifyAdmin().pipe(
        map((admin) => (admin ? ({ role: 'admin', admin } as Identity) : null))
      );
    }

    return this.verifyUser().pipe(
      map((user) => (user ? ({ role: 'user', user } as Identity) : null))
    );
  }

  // keep old name for compatibility
  ensureUserLoaded(): Observable<UserInfo | null> {
    return this.verifyUser();
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey);

    this.token.set(null);
    this.role.set('user');

    this.currentUser.set(null);
    this.currentAdmin.set(null);
    this.identity.set(null);
  }

  // ---------------- INTERNAL ----------------

  private setSession(token: string, role: Role): void {
    if (!token?.trim()) return;

    localStorage.setItem(this.tokenKey, token);
    this.token.set(token);

    this.storeRole(role);
    this.role.set(role);

    // reset identity; will be loaded by verify
    this.identity.set(null);
  }

  private storeRole(role: Role): void {
    localStorage.setItem(this.roleKey, role);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getStoredRole(): Role | null {
    const v = localStorage.getItem(this.roleKey);
    return v === 'admin' || v === 'user' ? v : null;
  }
}
