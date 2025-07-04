import { Component } from '@angular/core';
import { AdminAuthService } from '../../core/admin-auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.scss'
})
export class AdminLogin {
  adminName = '';
  adminPassword = '';
  returnUrl = '/admin/dashboard';

  constructor(
    private adminAuthService: AdminAuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  login() {
    this.adminAuthService.login({ adminName: this.adminName, adminPassword: this.adminPassword }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
