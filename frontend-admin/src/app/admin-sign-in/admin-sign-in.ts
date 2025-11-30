
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';


@Component({
  selector: 'app-admin-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: 'admin-sign-in.html',
  styleUrls: ['admin-sign-in.css'],
})

export class AdminSignIn {
  private fb = inject(FormBuilder);
  private auth = inject(AdminAuthService);
  private router = inject(Router);

  submitting = false;
  error = '';

  form = this.fb.group({
    adminName: ['', [Validators.required]],
    adminPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    const dto = {
      adminName: this.form.value.adminName ?? '',
      adminPassword: this.form.value.adminPassword ?? '',
    };

    this.auth.login(dto).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        console.error('[AdminSignIn] login error:', err);
        this.submitting = false;
        if (err.status === 400 || err.status === 401) {
          this.error = 'Admin name or password is incorrect.';
        } else {
          this.error = 'Login failed. Please try again later.';
        }
      },
    });
  }
}
