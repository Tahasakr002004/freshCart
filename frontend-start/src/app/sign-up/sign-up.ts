import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
<<<<<<< HEAD
=======
import { CommonModule } from '@angular/common';
>>>>>>> frontend-auth

@Component({
  selector: 'app-sign-up',
  standalone: true,
<<<<<<< HEAD
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
=======
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-up.html',
>>>>>>> frontend-auth
})
export class SignUp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
<<<<<<< HEAD
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
=======
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
>>>>>>> frontend-auth
  });

  submitting = false;
  error: string | null = null;

<<<<<<< HEAD
  submit() {
    if (this.form.invalid || this.form.value.password !== this.form.value.confirmPassword) {
      if (this.form.value.password !== this.form.value.confirmPassword) {
        this.error = 'Passwörter stimmen nicht überein';
      }
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = null;

    const { confirmPassword, ...payload } = this.form.getRawValue() as any;

    this.auth.register(payload).subscribe({
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = (err?.error ?? 'Registrierung fehlgeschlagen');
        this.submitting = false;
      }
=======
  get f() {
    return this.form.controls;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = null;

    this.auth.register(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.data ?? 'Registrierung fehlgeschlagen';
      },
>>>>>>> frontend-auth
    });
  }
}
