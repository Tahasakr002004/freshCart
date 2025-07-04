import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  UserRegisterRequest,
  UserLoginRequest,
  UserLoginResponse
} from '../models/user.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private baseUrl = 'http://localhost:5000/user';

  constructor(private http: HttpClient) {}

  register(data: UserRegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: UserLoginRequest): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(`${this.baseUrl}/login`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('userToken', res.token);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userToken');
  }

  getToken(): string | null {
    return localStorage.getItem('userToken');
  }
}
