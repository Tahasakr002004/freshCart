import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, map } from 'rxjs';

export interface Product {
  _id?: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
}

interface ProductsResponse {
  data: Product[];
  pagination?: any;
}

@Injectable({ providedIn: 'root' })
export class AdminProductService {
  private readonly productBaseUrl = `${environment.apiBaseUrl}/product`;
  private readonly adminProductBaseUrl = `${environment.apiBaseUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Shop products (public)
  getAll(): Observable<Product[]> {
    return this.http.get<ProductsResponse>(this.productBaseUrl).pipe(map((res) => res.data));
  }

  
  // Admin: CREATE product => POST /admin/products/item
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.adminProductBaseUrl}/products/item`, product);
  }

  // Admin: DELETE product => DELETE /admin/products/:id
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminProductBaseUrl}/products/${id}`);
  }
}
