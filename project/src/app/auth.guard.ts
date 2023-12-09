import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UsersService } from '@appRoot/services/users.service';

export const authGuard: CanActivateFn = () => {
  const usersService = inject(UsersService);
  const router = inject(Router);
  const hasSession = !!usersService.session;

  return hasSession || router.createUrlTree(['/']);
};
