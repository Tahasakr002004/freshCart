import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map } from 'rxjs';

type LoginMode = 'user' | 'admin';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrls: ['./sign-in.css'],
})
export class SignIn implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  submitting = false;
  error = '';

  form = this.fb.group({
    mode: ['user' as LoginMode, [Validators.required]],
    identifier: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  get f() {
    return this.form.controls;
  }

  get mode(): LoginMode {
    return (this.form.value.mode ?? 'user') as LoginMode;
  }

  ngOnInit(): void {
    this.form.controls.mode.valueChanges.subscribe((m) => {
      const mode = (m ?? 'user') as LoginMode;
      const identifier = this.form.controls.identifier;

      identifier.clearValidators();

      if (mode === 'admin') {
        identifier.setValidators([Validators.required]);
      } else {
        identifier.setValidators([Validators.required, Validators.email]);
      }

      identifier.updateValueAndValidity();
    });

    if (this.auth.isAuthenticated()) {
      this.auth.ensureIdentityLoaded().subscribe(() => {
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

    const mode = this.mode;
    const identifier = (this.form.value.identifier ?? '').trim();
    const password = this.form.value.password ?? '';

    const login$ : Observable<void> =
      mode === 'admin'
        ? this.auth.loginAdmin({ adminName: identifier, adminPassword: password }).pipe(map(() => void 0))
        : this.auth.loginUser({ email: identifier, password }).pipe(map(() => void 0));

    login$.subscribe({
      next: () => {
        this.submitting = false;
        this.router.navigate(['/shop']);
      },
      error: (err) => {
        console.error('[SignIn] login error:', err);
        this.submitting = false;

        if (err.status === 400 || err.status === 401) {
          this.error =
            mode === 'admin'
              ? 'Admin name or password is incorrect.'
              : 'Email or password is incorrect.';
        } else {
          this.error = 'Sign in failed. Please try again later.';
        }
      },
    });
  }
}
