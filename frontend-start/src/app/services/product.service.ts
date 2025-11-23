import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = '/product';

  constructor() {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getProduct(id: string): Observable<Product> {
    return this.http
      .get<{ data: Product }>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }


  private handleError(error: HttpErrorResponse) {
    console.error('ProductService error', error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
