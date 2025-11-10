import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.html',
})
export class SignIn {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5432/admin';

  



  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  error: string | null = null;
  submitting = false;

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

    this.auth.login(this.form.getRawValue() as any).subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.data ?? 'Login fehlgeschlagen';
      },
    });
  }
}
import { Component } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  imports: [],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {

}
