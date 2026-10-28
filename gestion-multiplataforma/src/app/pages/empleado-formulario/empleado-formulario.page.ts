import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService, NuevoEmpleado } from '../../services/auth';
import { NavegacionComponent } from '../../components/navegacion/navegacion.component';

type EmpleadoFormControls = {
  nombre: FormControl<string>;
  email: FormControl<string>;
  edad: FormControl<number>;
  salario: FormControl<number>;
  rol: FormControl<'Admin' | 'User'>;
};

@Component({
  selector: 'app-empleado-formulario',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToolbar,
    NavegacionComponent
  ],
  templateUrl: './empleado-formulario.page.html',
  styleUrl: './empleado-formulario.page.scss'
})
export class EmpleadoFormularioPage {
  public guardando = signal(false);
  public empleadoForm: FormGroup<EmpleadoFormControls>;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  constructor() {
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

  async guardarEmpleado(): Promise<void> {
    if (this.empleadoForm.invalid || this.empleadoForm.pending) {
      this.empleadoForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const {
      nombre,
      email,
      edad,
      salario,
      rol
    } = this.empleadoForm.getRawValue();

    const nuevoEmpleado: NuevoEmpleado = {
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      edad: Number(edad),
      salario: Number(salario),
      rol,
      activo: true
    };

    try {
      await this.authService.crearEmpleado(nuevoEmpleado);
      await this.mostrarToast('Empleado registrado correctamente', 'success');
      await this.router.navigate(['/usuarios']);
    } catch (error) {
      console.error('Error al registrar empleado:', error);
      await this.mostrarToast('No se pudo registrar el empleado', 'danger');
    } finally {
      this.guardando.set(false);
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
