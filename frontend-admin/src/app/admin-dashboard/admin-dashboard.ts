
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductService, Product } from '../services/admin-product.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  private productService = inject(AdminProductService);
  private auth = inject(AdminAuthService);
  private fb = inject(FormBuilder);

  products: Product[] = [];
  loading = false;
  loadError = '';

  creating = false;
  createError = '';
  deletingId: string | null = null;

  adminName: string | null = null;

  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required]],
    imageUrl: ['/images/apple_2.jpg', Validators.required],
    stock: [0, [Validators.required]],
  });

  ngOnInit(): void {
    this.loadProducts();
    this.auth.loadAdminInfo().subscribe(info => {
      this.adminName = info?.adminName ?? null;
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.loadError = '';
    this.productService.getAll().subscribe({
      next: products => {
        this.products = products;
        this.loading = false;
      },
      error: err => {
        console.error('[AdminDashboard] loadProducts error:', err);
        this.loadError = 'Failed to load products.';
        this.loading = false;
      },
    });
  }

  createProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.creating = true;
    this.createError = '';

    const product: Product = {
      name: this.productForm.value.name ?? '',
      price: Number(this.productForm.value.price ?? 0),
      imageUrl: this.productForm.value.imageUrl ?? '',
      stock: Number(this.productForm.value.stock ?? 0),
    };

    this.productService.create(product).subscribe({
      next: created => {
        this.creating = false;
        this.products.push(created);
        this.productForm.reset({
          name: '',
          price: 0,
          imageUrl: '/images/apple_2.jpg',
          stock: 0,
        });
      },
      error: err => {
        console.error('[AdminDashboard] createProduct error:', err);
        this.creating = false;
        this.createError = 'Failed to create product.';
      },
    });
  }

  deleteProduct(p: Product): void {
    if (!p._id) return;

    this.deletingId = p._id;
    this.productService.delete(p._id).subscribe({
      next: () => {
        this.deletingId = null;
        this.products = this.products.filter(x => x._id !== p._id);
      },
      error: err => {
        console.error('[AdminDashboard] deleteProduct error:', err);
        this.deletingId = null;
        // you might add error message
      },
    });
  }

  logout(): void {
    this.auth.logout();
    window.location.href = '/admin-sign-in';
  }
}
