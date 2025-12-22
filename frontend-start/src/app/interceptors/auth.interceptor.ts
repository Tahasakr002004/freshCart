import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  // Do NOT attach token to login/register requests
  const isAuthRequest =
    req.url.includes('/user/login') ||
    req.url.includes('/user/register') ||
    req.url.includes('/admin/loginadmin') ||
    req.url.includes('/admin/registeradmin');

  if (token && !isAuthRequest) {
    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      })
    );
  }

  return next(req);
};
