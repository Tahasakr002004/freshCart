import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface UsersResponse {
  data: User[];
  pagination?: any;
}

@Injectable({ providedIn: 'root' })
export class AdminUserService {
  //private readonly userBaseUrl = `${environment.apiBaseUrl}/product`;
  private readonly adminuserBaseUrl = `${environment.apiBaseUrl}/admin/users`;

  constructor(private http: HttpClient) {}

  // Shop products (public)
  // getAll(): Observable<User[]> {
  //   return this.http.get<UsersResponse>(this.adminuserBaseUrl).pipe(map((res) => res.data));
  // }
getAll(): Observable<User[]> {
  return this.http.get<User[]>(this.adminuserBaseUrl);
}


  // Admin: DELETE product => DELETE /admin/products/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminuserBaseUrl}/${id}`);
  }
}
