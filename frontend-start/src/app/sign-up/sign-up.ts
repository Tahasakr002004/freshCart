import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css'
})
export class SignUp {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  submitting = false;
  error: string | null = null;

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
    });
  }
}
