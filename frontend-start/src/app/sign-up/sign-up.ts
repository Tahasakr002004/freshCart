
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrls: ['./sign-up.css'],
})
export class SignUp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  error = '';

  form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() {
    return this.form.controls;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    const dto = {
      firstName: this.form.value.firstName ?? '',
      lastName: this.form.value.lastName ?? '',
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    console.log('[SignUp] submit() called', dto);

    this.auth.register(dto).subscribe({
      next: () => {
        this.submitting = false;
        // Nach Registrierung zum Login
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        console.error('[SignUp] register error:', err);
        this.submitting = false;
        if (err.status === 409) {
          this.error = 'A user with this email already exists.';
        } else {
          this.error = 'Registration failed. Please try again later.';
        }
      },
    });
  }
}
