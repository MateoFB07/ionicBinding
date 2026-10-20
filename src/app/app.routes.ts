import { Routes } from '@angular/router';

// 8. La ruta de registro reemplaza a la antigua ruta de home.
export const routes: Routes = [
  {
    path: 'registro',
    loadComponent: () => import('./registro/registro.page').then((m) => m.RegistroPage),
  },
  {
    path: '',
    redirectTo: 'registro',
    pathMatch: 'full',
  },
];
