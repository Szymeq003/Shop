import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const requiredRole = route.data['role'];

  const user = auth.currentUser();
  if (user && user.role === requiredRole) {
    return true;
  }

  router.navigate(['/']);
  return false;
};
