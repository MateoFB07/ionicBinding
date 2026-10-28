import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'inicio',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'dashboard',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./pages/usuarios/usuarios.page').then(m => m.UsuariosPage),
    canActivate: [authGuard]
  },
  {
    path: 'usuarios/nuevo',
    loadComponent: () => import('./pages/empleado-formulario/empleado-formulario.page')
      .then(m => m.EmpleadoFormularioPage),
    canActivate: [authGuard],
    data: { rol: 'Admin' }
  },
  {
    path: 'informes',
    loadComponent: () => import('./pages/informes/informes.page').then(m => m.InformesPage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];