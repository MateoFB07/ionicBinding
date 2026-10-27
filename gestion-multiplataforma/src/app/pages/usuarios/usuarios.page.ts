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
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {
  IonBackButton,
  IonButton,
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
  IonInput,
  IonItem,
  IonLabel,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { Empleado } from '../../models/empleado.interface';
import { AuthService, NuevoEmpleado } from '../../services/auth';
import { TablaUsuariosComponent } from '../../components/tabla-usuarios/tabla.usuario.component';

Chart.register(...registerables);

type EmpleadoFormControls = {
  nombre: FormControl<string>;
  email: FormControl<string>;
  contraseña: FormControl<string>;
  edad: FormControl<number>;
  salario: FormControl<number>;
  rol: FormControl<'Admin' | 'User'>;
};

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonCardContent,
    IonButton,
    IonButtons,
    IonBackButton,
    IonSpinner,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    TablaUsuariosComponent
  ]
})
export class UsuariosPage implements OnInit, OnDestroy {
  @ViewChild('graficoRoles') graficoRolesCanvas?: ElementRef<HTMLCanvasElement>;

  public cargando = signal(true);
  public guardando = signal(false);
  public empleados = signal<Empleado[]>([]);
  public esAdmin = false;
  public empleadoForm!: FormGroup<EmpleadoFormControls>;

  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);
  private miGrafico: Chart | null = null;
  private graficoTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.inicializarFormulario();

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

  private inicializarFormulario(): void {
    this.empleadoForm = new FormGroup<EmpleadoFormControls>({
      nombre: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
        asyncValidators: [(control: AbstractControl): Promise<ValidationErrors | null> =>
          this.validarEmail(control)
        ],
        updateOn: 'blur'
      }),
      contraseña: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(6)]
      }),
      edad: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(16)]
      }),
      salario: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0)]
      }),
      rol: new FormControl<'Admin' | 'User'>('User', {
        nonNullable: true,
        validators: [Validators.required]
      })
    });
  }

  private async validarEmail(control: AbstractControl): Promise<ValidationErrors | null> {
    const email = String(control.value ?? '').trim();
    if (!email || control.hasError('email')) {
      return null;
    }

    try {
      return await this.authService.existeEmail(email)
        ? { emailRepetido: true }
        : null;
    } catch (error) {
      console.error('No se pudo validar el correo en Supabase:', error);
      return { emailValidationUnavailable: true };
    }
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

  async guardarEmpleado(): Promise<void> {
    if (this.empleadoForm.invalid || this.empleadoForm.pending) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const {
      nombre,
      email,
      contraseña,
      edad,
      salario,
      rol
    } = this.empleadoForm.getRawValue();

    const nuevoEmpleado: NuevoEmpleado = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      contraseña,
      edad: Number(edad),
      salario: Number(salario),
      rol,
      activo: true
    };

    try {
      await this.authService.crearEmpleado(nuevoEmpleado);
      await this.mostrarToast('Empleado registrado correctamente', 'success');
      this.empleadoForm.reset({
        nombre: '',
        email: '',
        contraseña: '',
        edad: 0,
        salario: 0,
        rol: 'User'
      });
      await this.cargarUsuarios();
    } catch (error) {
      console.error('Error al registrar empleado:', error);
      await this.mostrarToast('No se pudo registrar el empleado', 'danger');
    } finally {
      this.guardando.set(false);
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
