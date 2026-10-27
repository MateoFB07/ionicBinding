import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {
  IonBackButton,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth';
import { Empleado } from '../../models/empleado.interface';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, IonHeader, IonToolbar, IonTitle, IonContent, 
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, 
    IonCardSubtitle, IonCardContent, IonBadge, IonButtons, 
    IonBackButton, IonSpinner
  ]
})
export class UsuariosPage implements OnInit, OnDestroy {
  @ViewChild('graficoRoles') graficoRolesCanvas!: ElementRef;

  // Señal reactive para el estado de carga y la lista de empleados
  public cargando = signal<boolean>(true);
  public empleados = signal<Empleado[]>([]);
  public esAdmin: boolean = false;
  private miGrafico: Chart | null = null;
  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);

  constructor() {
    // Reacción automática: cuando la señal 'empleados' cambie y no esté cargando, dibuja el gráfico
    effect(() => {
      const lista = this.empleados();
      const estaCargando = this.cargando();
      
      if (!estaCargando && lista.length > 0) {
        setTimeout(() => this.crearGrafico(), 100);
      }
    });
  }

  ngOnDestroy(): void {
    this.miGrafico?.destroy();
  }

  ngOnInit(): void {
    this.esAdmin = this.authService.getRol() === 'Admin';
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarUsuarios();
  }

  async cargarUsuarios(): Promise<void> {
    // Emitimos la señal de inicio de carga
    this.cargando.set(true);

    try {
      const datos = await this.authService.getEmpleados();
      // Notificamos a Angular actualizando la señal con los datos de Supabase
      this.empleados.set(datos);
    } catch (error) {
      console.error('Error al obtener datos de Supabase:', error);
      await this.mostrarToast('Error al conectar con la base de datos', 'danger');
    } finally {
      // Notificamos la señal de fin de carga para actualizar la vista automáticamente
      this.cargando.set(false);
    }
  }

  private crearGrafico(): void {
    if (!this.graficoRolesCanvas) return;
    if (this.miGrafico) this.miGrafico.destroy();

    const lista = this.empleados();
    const conteoRoles: Record<string, number> = {};

    lista.forEach(emp => {
      const rol = emp.rol || 'User';
      conteoRoles[rol] = (conteoRoles[rol] || 0) + 1;
    });

    try {
      this.miGrafico = new Chart(this.graficoRolesCanvas.nativeElement, {
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

  private async mostrarToast(msg: string, color: 'danger' | 'success' = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}