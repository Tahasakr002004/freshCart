import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Cart } from '../models/cart.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = 'http://localhost:5000/cart';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}`, this.getAuthHeaders());
  }

  addItem(productId: string, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/items`, { productId, quantity }, this.getAuthHeaders());
  }

  updateItem(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.baseUrl}/items`, { productId, quantity }, this.getAuthHeaders());
  }

  removeItem(productId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/items/${productId}`, this.getAuthHeaders());
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${this.baseUrl}`, this.getAuthHeaders());
  }
}
