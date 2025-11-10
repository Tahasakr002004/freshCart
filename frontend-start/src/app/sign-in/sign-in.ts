import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
<<<<<<< HEAD
=======
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

>>>>>>> frontend-auth

@Component({
  selector: 'app-sign-in',
  standalone: true,
<<<<<<< HEAD
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
=======
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './sign-in.html',
>>>>>>> frontend-auth
})
export class SignIn {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

<<<<<<< HEAD
=======
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:5432/admin';

  



>>>>>>> frontend-auth
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

<<<<<<< HEAD
  submitting = false;
  error: string | null = null;
=======
  error: string | null = null;
  submitting = false;

  get f() {
    return this.form.controls;
  }
>>>>>>> frontend-auth

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
<<<<<<< HEAD
=======

>>>>>>> frontend-auth
    this.submitting = true;
    this.error = null;

    this.auth.login(this.form.getRawValue() as any).subscribe({
<<<<<<< HEAD
      next: () => this.router.navigateByUrl('/dashboard'),
      error: (err) => {
        this.error = (err?.error ?? 'Login fehlgeschlagen');
        this.submitting = false;
      }
    });
  }
}
=======
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
>>>>>>> frontend-auth
