# Frontend documentation
### Project initialisation
```
npm install -g @angular/cli
ng new frontend --routing --style=scss --standalone=false
cd frontend
```
Everyone needs to install angular with -g (global install) for the frontend to run.
### Module generation
```
ng generate module core
ng generate module shared
ng generate module admin --route admin --module app.module
ng generate module customer --route user --module app.module
ng generate module shop --route shop --module app.module
```
The modules are generated just like in the FrontendComponentStructure.drawio
The core module consists of services which are required for the HTTP connection and the authorization, as well as auth guard services.
### Component generation inside the modules
```
ng generate component admin/admin-login
ng generate component admin/admin-register
ng generate component admin/admin-dashboard
ng generate component admin/product-edit
ng generate component admin/add-product
```

```
ng generate component user/user-login
ng generate component user/user-register
ng generate component user/profile
ng generate component user/cart
ng generate component user/checkout
```

```
ng generate component shop/product-list
ng generate component shop/product-detail
```

```
ng generate component shared/header
ng generate component shared/footer
ng generate component shared/modal
```
The components are generated as well just like in the FrontendComponentStructure.drawio

### Model creation
```
ng generate interface models/user --type=model
ng generate interface models/admin --type=model
ng generate interface models/cart --type=model
ng generate interface models/order --type=model
ng generate interface models/product --type=model
```
The models are used later by API calls.

Here you should mirror the API calls from the backend. You can usually copy the models from the backend except for a few backend and security related things:

* Mongoose Schema and logic
* Sequelize Model or Datatypes
* Passwords, especially the admin password



For login forms you should create login request interfaces to be used in AuthService.



### API Connection

In app-module.ts add ```provideHttpClient(withInterceptorsFromDi())``` inside the providers.\
Generate product service using ```ng generate service core/product``` which should interact with the productRouter in the backend.



In the backend:
```
npm install cors
npm i --save-dev @types/cors
```

In index.ts:
```
import cors from 'cors';
app.use(cors({
origin: 'http://localhost:4200', // Angular dev server
credentials: true
}));
```


Now you can implement the service in your components to display products for example.



### User/Admin API with JWT

First in admin model add:
```
export interface AdminLoginResponse {
token: string;
}

export interface AdminDashboardResponse {
message: string;
}
```


Now implement the service logic. (see admin-auth.ts)

Do the same for the user.

Use these only for login and register.



### Create shared AuthService for better Auth Flow
```
ng generate service core/auth
```
Use this for injection into route guards, components, navbars, etc.

### Modify routes
Change the routing for the main app:
```
const routes: Routes = [
  { path: '', redirectTo: 'shop', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },
  { path: '**', redirectTo: 'shop' }
];
```
and for the user, admin and shop modules as needed.

### Add Auth Guard to restrict access to pages without login
```
ng generate guard guards/user
ng generate guard guards/admin
```
Create shared AuthService
```
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  getUserToken(): string | null {
    return localStorage.getItem('userToken');
  }

  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  isUserLoggedIn(): boolean {
    return !!this.getUserToken();
  }

  isAdminLoggedIn(): boolean {
    return !!this.getAdminToken();
  }

  logout(): void {
    localStorage.removeItem('userToken');
    localStorage.removeItem('adminToken');
  }
}
```
Implement Guard, for example User Guard:
```
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isUserLoggedIn()) {
    return true;
  } else {
    router.navigate(['/user/login']);
    return false;
  }
};
```
Do the same for Admin Guard.\
Now you can use "canActivate" in the routes like this:
```
const routes: Routes = [
  { path: 'dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [adminGuard] },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [adminGuard] },
];
```
Now the routes are protected by checking login status and unauthenticated users are redirected to login.

### Route Based Redirection
When a user tries to access a protected route (e.g. /user/checkout) but isn’t logged in, they get redirected to /user/login?returnUrl=/user/checkout, and after logging in, they’re automatically sent back to /user/checkout.



Inside the guards add:
```
router.navigate(['/user/login'], {
      queryParams: { returnUrl: state.url }
    });
```
Do the same for admin.\
Then inside the login component add this:
```
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserAuthService } from '../../core/user-auth.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html'
})
export class UserLoginComponent {
  email = '';
  password = '';
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
```

### HTTP Interceptor for Token Injection
Automatically attach the correct token (user or admin) to every HTTP request.\
First generate the interceptor using
```
ng generate interceptor interceptors/auth
```
Setup the interceptor like this:
```
// src/app/interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const userToken = localStorage.getItem('userToken');
  const adminToken = localStorage.getItem('adminToken');
  const token = userToken || adminToken;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};
```
Finally register the interceptor inside the app module using```provideHttpClient(withInterceptors([authInterceptor]))```\
Now all your HTTP requests will automatically have the Authorization header if a userToken or adminToken is stored.