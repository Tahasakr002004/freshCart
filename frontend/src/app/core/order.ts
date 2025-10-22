import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order, CheckoutRequest } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:5000/order';

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('userToken');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/items`, this.getAuthHeaders());
  }

  checkout(address: string): Observable<Order> {
    const body: CheckoutRequest = { address };
    return this.http.post<Order>(`${this.baseUrl}/checkout`, body, this.getAuthHeaders());
  }
}
