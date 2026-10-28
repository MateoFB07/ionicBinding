import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import { AuthService, PerfilEmpleadoNoEncontradoError } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonInput,
    IonButton,
    IonSpinner,
    IonText,
  ]
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  public isSubmitting: boolean = false;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastController = inject(ToastController);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  public seleccionarAccesoDemo(tipo: 'admin' | 'usuario'): void {
    const email = tipo === 'admin' ? 'admin@admin.com' : 'prueba@prueba.com';
    const password = tipo === 'admin' ? 'admin123' : 'prueba123456';
    this.loginForm.patchValue({ email, password });
    this.loginForm.get('email')?.markAsTouched();
  }

  /**
   * Inicia sesión de forma directa y automática según la cuenta demo pulsada
   */
  public async accesoDemoDirecto(tipo: 'admin' | 'usuario'): Promise<void> {
    this.isSubmitting = true;

    const emailDemo = tipo === 'admin' ? 'admin@admin.com' : 'prueba@prueba.com';
    const passDemo = tipo === 'admin' ? 'admin123' : 'prueba123456';

    this.loginForm.patchValue({
      email: emailDemo,
      password: passDemo
    });

    try {
      const usuario = await this.authService.login(emailDemo, passDemo);

      if (usuario) {
        const rutaDestino = usuario.rol === 'Admin' ? '/dashboard' : '/usuarios';
        await this.router.navigate([rutaDestino]);
      } else {
        await this.mostrarErrorToast('No se encontró la cuenta demo en Supabase.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión demo:', error);
      await this.mostrarErrorToast('Error de autenticación. Verifica la conexión con Supabase.');
    } finally {
      this.isSubmitting = false;
    }
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      await this.mostrarErrorToast('Por favor, completa los campos correctamente.');
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    try {
      const usuario = await this.authService.login(email, password);

      if (usuario) {
        const rutaDestino = usuario.rol === 'Admin' ? '/dashboard' : '/usuarios';
        await this.router.navigate([rutaDestino]);
      } else {
        await this.mostrarErrorToast('Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.mostrarErrorToast(
        error instanceof PerfilEmpleadoNoEncontradoError
          ? `${error.message} Para Admin, crea la fila con rol Admin.`
          : 'No se pudo iniciar sesión. Revisa la conexión y las políticas RLS de Supabase.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  private async mostrarErrorToast(mensaje: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }
}