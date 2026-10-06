import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./pages/inicio/inicio.page').then(m => m.InicioPage)
  },
  {
    path: 'productos',
    loadComponent: () =>
      import('./pages/productos/productos.page').then(m => m.ProductosPage)
  },
  {
    path: '**',
    redirectTo: 'inicio'
  }
];