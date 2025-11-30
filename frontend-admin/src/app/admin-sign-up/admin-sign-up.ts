
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminAuthService } from '../services/admin-auth.service';

@Component({
  selector: 'app-admin-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin-sign-up.html',
  styleUrls: ['./admin-sign-up.css'],
})
export class AdminSignUp {
  private fb = inject(FormBuilder);
  private auth = inject(AdminAuthService);
  private router = inject(Router);

  submitting = false;
  error = '';
  message = '';

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
    this.message = '';

    const dto = {
      adminName: this.form.value.adminName ?? '',
      adminPassword: this.form.value.adminPassword ?? '',
    };

    this.auth.register(dto).subscribe({
      next: (resText) => {
        this.submitting = false;
        this.message =  'Admin registered successfully.';
       // Optionally auto-redirect:
        this.router.navigate(['/admin-sign-in']);
      },
      error: err => {
        console.error('[AdminSignUp] register error:', err);
        this.submitting = false;
        this.error = 'Registration failed. Please try again later.';
      },
    });
  }
}
