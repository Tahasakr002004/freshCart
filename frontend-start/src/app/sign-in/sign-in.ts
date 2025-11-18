// src/app/sign-in/sign-in.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignIn implements OnInit {
  // 👉 Services per inject(), kein constructor nötig
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  error = '';

  // 👉 jetzt ist fb DEFINITIV initialisiert, bevor form gebaut wird
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    // Wenn schon eingeloggt → direkt weiter
    if (this.auth.isAuthenticated()) {
      this.auth.ensureUserLoaded().subscribe(() => {
        this.router.navigate(['/shop']);
      });
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting = true;
    this.error = '';

    const dto = {
      email: this.form.value.email ?? '',
      password: this.form.value.password ?? '',
    };

    this.auth.login(dto).subscribe({
      next: () => {
        this.submitting = false;
        // 👉 nach Login weiter zum Shop
        this.router.navigate(['/shop']);
      },
      error: (err) => {
        console.error('[SignIn] login error:', err);
        this.submitting = false;
        if (err.status === 400 || err.status === 401) {
          this.error = 'E-Mail oder Passwort ist falsch.';
        } else {
          this.error = 'Login fehlgeschlagen. Bitte später erneut versuchen.';
        }
      },
    });
  }
}
