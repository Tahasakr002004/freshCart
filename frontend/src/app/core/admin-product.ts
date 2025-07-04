import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private baseUrl = 'http://localhost:5000/admin/products';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('adminToken');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/item`, product, {
      headers: this.getAuthHeaders()
    });
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product, {
      headers: this.getAuthHeaders()
    });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, {
      headers: this.getAuthHeaders()
    });
  }
}
