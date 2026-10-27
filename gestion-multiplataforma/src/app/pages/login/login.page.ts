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
import { AuthService } from '../../services/auth';

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
        await this.router.navigate(
          [usuario.rol === 'Admin' ? '/dashboard' : '/usuarios']
        );
      } else {
        await this.mostrarErrorToast('Correo o contraseña incorrectos.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      await this.mostrarErrorToast(
        'No se pudo conectar con Supabase. Comprueba tu conexión e inténtalo de nuevo.'
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