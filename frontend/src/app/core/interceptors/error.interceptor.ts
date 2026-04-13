import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error) => {
      if ([401, 403].includes(error.status)) {
        // Auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        auth.logout();
      }
      return throwError(() => error);
    })
  );
};
