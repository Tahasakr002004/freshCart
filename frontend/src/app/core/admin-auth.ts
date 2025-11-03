import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  AdminLoginRequest,
  AdminRegisterRequest,
  AdminLoginResponse,
  AdminDashboardResponse
} from '../models/admin.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private baseUrl = 'http://localhost:5000/admin';

  constructor(private http: HttpClient) {}

  register(data: AdminRegisterRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/registeradmin`, data);
  }

  login(data: AdminLoginRequest): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.baseUrl}/loginadmin`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem('adminToken', res.token); // store token for later
        })
      );
  }

  getDashboard(): Observable<AdminDashboardResponse> {
    const token = localStorage.getItem('adminToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<AdminDashboardResponse>(`${this.baseUrl}/dashboard`, { headers });
  }

  logout(): void {
    localStorage.removeItem('adminToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('adminToken');
  }
}
