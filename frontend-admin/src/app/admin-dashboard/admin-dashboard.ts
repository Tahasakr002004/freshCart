import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminProductService, Product } from '../services/admin-product.service';
import { AdminAuthService } from '../services/admin-auth.service';
import { AdminUserService, User } from '../services/admin-user.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css'],
})
export class AdminDashboard implements OnInit {
  private productService = inject(AdminProductService);
  private userService = inject(AdminUserService);
  private auth = inject(AdminAuthService);
  private fb = inject(FormBuilder);

  // ---------- STATE ----------
  products: Product[] = [];
  Users: User[] = [];

  loading = false;
  loadError = '';

  loadingUsers = false;

  creating = false;
  createError = '';
  deletingId: string | null = null;

  adminName: string | null = null;

  // Images that exist in backend/public/freshcartImages
  availableImages: string[] = [];

  // Admin types product data, and chooses image file name from select
  productForm = this.fb.group({
    name: ['', Validators.required],
    price: [0, [Validators.required]],
    imageFileName: ['', Validators.required], // <- only file name, e.g. "apple_2.jpg"
    stock: [0, [Validators.required]],
  });

  // ---------- INIT ----------
  ngOnInit(): void {
    this.loadProducts();
    this.loadUsers();
    this.loadImages();

    this.auth.loadAdminInfo().subscribe((info) => {
      this.adminName = info?.adminName ?? null;
    });
  }

  // ---------- IMAGES FROM BACKEND ----------
  loadImages(): void {
    this.productService.getAvailableImages().subscribe({
      next: (files) => {
        this.availableImages = files;
      },
      error: (err) => {
        console.error('[AdminDashboard] loadImages error:', err);
        // We don’t block the whole dashboard if this fails
      },
    });
  }

  // ---------- PRODUCTS ----------
  loadProducts(): void {
    this.loading = true;
    this.loadError = '';

    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (err) => {
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

    // Take the file name from the form (e.g. "apple_2.jpg")
    let imageFileName = this.productForm.value.imageFileName?.trim() || '';

    // If admin accidentally types "/images/apple_2.jpg",
    // take only "apple_2.jpg"
    if (imageFileName.includes('/')) {
      imageFileName = imageFileName.split('/').pop() || imageFileName;
    }

    const product: Product = {
      name: this.productForm.value.name ?? '',
      price: Number(this.productForm.value.price ?? 0),
      // Build the URL that the backend serves statically
      imageUrl: `/images/${imageFileName}`,
      stock: Number(this.productForm.value.stock ?? 0),
    };

    this.productService.create(product).subscribe({
      next: (created) => {
        this.creating = false;
        this.products.push(created);

        // Reset form
        this.productForm.reset({
          name: '',
          price: 0,
          imageFileName: '',
          stock: 0,
        });
      },
      error: (err) => {
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
        this.products = this.products.filter((x) => x._id !== p._id);
      },
      error: (err) => {
        console.error('[AdminDashboard] deleteProduct error:', err);
        this.deletingId = null;
      },
    });
  }

  // ---------- AUTH ----------
  logout(): void {
    this.auth.logout();
    window.location.href = '/admin-sign-in';
  }

  // ---------- USERS ----------
  deleteUser(u: User): void {
    if (!u._id) return;

    this.deletingId = u._id;

    this.userService.delete(u._id).subscribe({
      next: () => {
        this.deletingId = null;
        this.Users = this.Users.filter((x) => x._id !== u._id);
      },
      error: (err) => {
        console.error('[AdminDashboard] deleteUser error:', err);
        this.deletingId = null;
      },
    });
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.loadError = '';

    this.userService.getAll().subscribe({
      next: (users) => {
        console.log('Users from backend:', users);
        this.Users = users;
        this.loadingUsers = false;
      },
      error: (err) => {
        console.error('[AdminDashboard] loadUsers error:', err);
        this.loadError = 'Failed to load users.';
        this.loadingUsers = false;
      },
    });
  }
}
