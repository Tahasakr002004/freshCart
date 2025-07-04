import { Component } from '@angular/core';
import { UserAuthService } from '../../core/user-auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  standalone: false,
  templateUrl: './user-login.html',
  styleUrl: './user-login.scss'
})
export class UserLogin {
  email = '';
  password  = '';
  returnUrl = '/user/profile';

  constructor(
    private authService: UserAuthService,
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
    this.authService.login({ email: this.email, password: this.password }).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
