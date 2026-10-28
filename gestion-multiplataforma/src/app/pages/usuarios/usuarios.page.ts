import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { Empleado } from '../../models/empleado.interface';
import { AuthService } from '../../services/auth';
import { NavegacionComponent } from '../../components/navegacion/navegacion.component';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla.usuario.component';

Chart.register(...registerables);

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSpinner,
    NavegacionComponent,
    TablaUsuariosComponent
  ]
})
export class UsuariosPage implements OnInit, OnDestroy {
  @ViewChild('graficoRoles') graficoRolesCanvas?: ElementRef<HTMLCanvasElement>;

  public cargando = signal(true);
  public empleados = signal<Empleado[]>([]);
  public esAdmin = false;

  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private miGrafico: Chart | null = null;
  private graficoTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      const lista = this.empleados();
      const estaCargando = this.cargando();

      if (!estaCargando && lista.length > 0) {
        if (this.graficoTimeout !== null) {
          clearTimeout(this.graficoTimeout);
        }
        this.graficoTimeout = setTimeout(() => this.crearGrafico(), 100);
      } else if (!estaCargando) {
        this.miGrafico?.destroy();
        this.miGrafico = null;
      }
    });
  }

  ngOnInit(): void {
    this.esAdmin = this.authService.getRol() === 'Admin';
  }

  ngOnDestroy(): void {
    if (this.graficoTimeout !== null) {
      clearTimeout(this.graficoTimeout);
    }
    this.miGrafico?.destroy();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    this.cargando.set(true);

    try {
      const datos = await this.authService.getEmpleados();
      this.empleados.set(datos);
    } catch (error) {
      console.error('Error al obtener datos de Supabase:', error);
      await this.mostrarToast('Error al conectar con la base de datos', 'danger');
    } finally {
      this.cargando.set(false);
    }
  }

  async eliminarEmpleado(id: number): Promise<void> {
    if (!this.esAdmin) {
      await this.mostrarToast('No tienes permisos para eliminar empleados', 'danger');
      return;
    }

    try {
      await this.authService.eliminarEmpleado(id);
      await this.mostrarToast('Empleado eliminado correctamente', 'success');
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      await this.mostrarToast('No se pudo eliminar el empleado', 'danger');
    }
  }

  private crearGrafico(): void {
    const canvas = this.graficoRolesCanvas?.nativeElement;
    if (!canvas) {
      return;
    }

    this.miGrafico?.destroy();

    const conteoRoles = this.empleados().reduce<Record<string, number>>((conteo, empleado) => {
      const rol = empleado.rol || 'User';
      conteo[rol] = (conteo[rol] ?? 0) + 1;
      return conteo;
    }, {});

    try {
      this.miGrafico = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: Object.keys(conteoRoles),
          datasets: [{
            data: Object.values(conteoRoles),
            backgroundColor: ['#3880ff', '#2dd36f', '#ffc409', '#eb445a'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            }
          }
        }
      });
    } catch (error) {
      console.error('Error al crear el gráfico de roles:', error);
    }
  }

  private async mostrarToast(
    mensaje: string,
    color: 'danger' | 'success'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
