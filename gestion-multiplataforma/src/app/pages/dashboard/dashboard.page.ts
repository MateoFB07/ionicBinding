import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonGrid, IonRow, IonCol, 
  IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, 
  IonBadge, IonButton, IonSpinner
} from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/user.interface';
import { Empleado } from '../../models/empleado.interface';
import { NavegacionComponent } from '../../components/navegacion/navegacion.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonBadge, IonButton, IonSpinner, NavegacionComponent
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

  ngOnInit(): void {
    const sesion = localStorage.getItem('usuario_sesion');
    if (sesion) {
      this.usuario = JSON.parse(sesion);
    }

    this.esAdmin = this.authService.getRol() === 'Admin';
  }

  async ionViewWillEnter(): Promise<void> {
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

}