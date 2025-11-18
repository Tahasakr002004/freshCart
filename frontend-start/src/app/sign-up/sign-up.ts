// src/app/sign-up/sign-up.ts
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
})
export class SignUp {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  submitting = false;
  error: string | null = null;

  readonly form = this.fb.group({
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
    this.error = null;

    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.submitting = false;
        // Nach erfolgreicher Registrierung -> Login-Seite
        this.router.navigateByUrl('/sign-in');
      },
      error: (err) => {
        this.submitting = false;
        this.error =
          typeof err?.error === 'string' && err.error
            ? err.error
            : 'Registrierung fehlgeschlagen';
      },
    });
  }
}
