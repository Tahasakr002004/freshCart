import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Order, CheckoutRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = '/order';

  orders = signal<Order[]>([]);
  loading = signal(false);
  error = signal('');

  constructor(private http: HttpClient) {}

  loadOrders(): void {
    this.loading.set(true);
    this.http.get<Order[]>(`${this.baseUrl}/items`).subscribe({
      next: o => {
        this.orders.set(o);
        this.loading.set(false);
      },
      error: err => {
        console.error(err);
        this.error.set('Failed loading orders');
        this.loading.set(false);
      }
    });
  }

  checkout(address: string): Observable<Order> {
    const body: CheckoutRequest = { address };
    return this.http.post<Order>(`${this.baseUrl}/checkout`, body).pipe(
      tap(order => {
        // optimistic refresh
        this.orders.update(list => [...list, order]);
      })
    );
  }
}