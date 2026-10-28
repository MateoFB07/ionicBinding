import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { IonButton, IonToolbar } from '@ionic/angular';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navegacion',
  standalone: true,
  imports: [IonToolbar, IonButton, RouterLink, RouterLinkActive],
  templateUrl: './navegacion.component.html',
  styleUrl: './navegacion.component.scss'
})
export class NavegacionComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  get esAdmin(): boolean {
    return this.authService.getRol() === 'Admin';
  }

  async cerrarSesion(): Promise<void> {
    try {
      await this.authService.logout();
    } catch (error) {
      console.error('No se pudo cerrar la sesión:', error);
    }
    void this.router.navigate(['/login']);
  }
}
