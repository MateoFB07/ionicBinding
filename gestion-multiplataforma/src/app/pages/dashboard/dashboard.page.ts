import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonBadge, IonButton, IonButtons, IonSpinner 
} from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/user.interface';
import { Empleado } from '../../models/empleado.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonButtons, IonSpinner
  ]
})
export class DashboardPage implements OnInit {
  public usuario: Usuario | null = null;
  public esAdmin: boolean = false;
  public cargando: boolean = true;

  // Métricas calculadas dinámicamente
  public totalEmpleados: number = 0;
  public totalMasaSalarial: number = 0;
  public empleadosActivos: number = 0;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  async ngOnInit(): Promise<void> {
    const sesion = localStorage.getItem('usuario_sesion');
    if (sesion) {
      this.usuario = JSON.parse(sesion);
    }

    this.esAdmin = this.authService.getRol() === 'Admin';
    await this.cargarMetricas();
  }

  async cargarMetricas(): Promise<void> {
    this.cargando = true;
    try {
      const empleados: Empleado[] = await this.authService.getEmpleados();
      
      // Cálculo de KPIs
      this.totalEmpleados = empleados.length;
      this.totalMasaSalarial = empleados.reduce((acc, emp) => acc + (Number(emp.salario) || 0), 0);
      this.empleadosActivos = empleados.filter(emp => emp.activo).length;
    } catch (error) {
      console.error('Error al calcular métricas en Dashboard:', error);
    } finally {
      this.cargando = false;
    }
  }

  public irAUsuarios(): void {
    this.router.navigate(['/usuarios']);
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}