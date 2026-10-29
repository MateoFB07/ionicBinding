import { Component, OnInit, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonButton,
  IonChip,
  IonLabel,
  IonSpinner,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { moonOutline, sunnyOutline } from 'ionicons/icons';
import { Chart, registerables } from 'chart.js';
import { AuthService } from '../../services/auth';
import { WidgetEstadisticoComponent } from '../../components/widget-estadistico/widget.estadistico.component';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonChip,
    IonLabel,
    IonSpinner,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    WidgetEstadisticoComponent
  ]
})
export class DashboardPage implements OnInit {
  @ViewChild('graficoMasaSalarial') private graficoCanvas!: ElementRef;

  public cargando = signal<boolean>(true);
  public esModoOscuro = signal<boolean>(false);
  public totalEmpleados: number = 0;
  public totalMasaSalarial: number = 0;
  private miGrafico!: Chart;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor() {
    addIcons({ moonOutline, sunnyOutline });
  }

  ngOnInit(): void {
    // Verificar preferencia guardada de modo oscuro
    const preferenciaOscura = localStorage.getItem('modoOscuro') === 'true';
    this.esModoOscuro.set(preferenciaOscura);
    document.body.classList.toggle('dark', preferenciaOscura);

    this.cargarMetricas();
  }

  public toggleModoOscuro(): void {
    const nuevoEstado = !this.esModoOscuro();
    this.esModoOscuro.set(nuevoEstado);
    document.body.classList.toggle('dark', nuevoEstado);
    localStorage.setItem('modoOscuro', String(nuevoEstado));

    // Actualizar colores del gráfico según el modo
    if (this.miGrafico) {
      const colorTexto = nuevoEstado ? '#ffffff' : '#333333';
      if (this.miGrafico.options.plugins?.legend?.labels) {
        this.miGrafico.options.plugins.legend.labels.color = colorTexto;
      }
      this.miGrafico.update();
    }
  }

  public async cargarMetricas(): Promise<void> {
    this.cargando.set(true);
    try {
      const datos = await this.authService.getEmpleados();
      
      this.totalEmpleados = datos.length;
      this.totalMasaSalarial = datos.reduce((acc, emp) => acc + (Number(emp.salario) || 0), 0);

      this.cargando.set(false);

      if (datos.length > 0) {
        setTimeout(() => this.crearGrafico(datos), 100);
      }
    } catch (error) {
      console.error('Error al cargar métricas del dashboard:', error);
      this.cargando.set(false);
    }
  }

  private crearGrafico(empleados: any[]): void {
    if (!this.graficoCanvas) return;
    if (this.miGrafico) this.miGrafico.destroy();

    const conteoRoles: { [key: string]: number } = {};
    empleados.forEach(e => {
      const rol = e.rol || 'User';
      conteoRoles[rol] = (conteoRoles[rol] || 0) + 1;
    });

    const colorTexto = this.esModoOscuro() ? '#ffffff' : '#333333';

    this.miGrafico = new Chart(this.graficoCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: Object.keys(conteoRoles),
        datasets: [{
          data: Object.values(conteoRoles),
          backgroundColor: ['#3880ff', '#2dd36f', '#ffc409', '#eb445a']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: colorTexto
            }
          }
        }
      }
    });
  }

  public async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }
}