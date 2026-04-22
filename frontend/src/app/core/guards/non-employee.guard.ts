import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const nonEmployeeGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.currentUser();
  if (user && user.role === 'pracownik') {
    router.navigate(['/employee']);
    return false;
  }

  return true;
};
