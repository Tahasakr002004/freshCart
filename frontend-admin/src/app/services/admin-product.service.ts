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

  getAll(): Observable<Product[]> {
    return this.http.get<ProductsResponse>(this.productBaseUrl).pipe(map((res) => res.data));
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.adminProductBaseUrl}/products/item`, product);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.adminProductBaseUrl}/products/${id}`);
  }

  //NEW: list available images from backend
  getAvailableImages(): Observable<string[]> {
    return this.http
      .get<{ files: string[] }>(`${this.adminProductBaseUrl}/product-images`)
      .pipe(map((res) => res.files));
  }
}
