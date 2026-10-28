import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si está autenticado
  if (!authService.isAuthenticated()) {
    return router.parseUrl('/login');
  }

  // 2. Verificar si la ruta requiere rol de Admin
  const rolRequerido = route.data['rol'] as string;
  if (rolRequerido && authService.getRol() !== rolRequerido) {
    return router.parseUrl('/inicio');
  }

  return true;
};