import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { firstValueFrom } from 'rxjs';

export const NotAuthenticatedGuard: CanMatchFn = async (
  route: Route,
  segments: UrlSegment[]
) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = await firstValueFrom(authService.checkStatus());
  console.log('isAuthenticated', isAuthenticated);
  if (isAuthenticated) {
    // Redirect to the home page if the user is authenticated
    await router.navigateByUrl('/');
    return false;
  }
  return true;
};
