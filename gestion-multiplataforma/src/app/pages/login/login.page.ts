/* eslint-disable @angular-eslint/prefer-inject */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
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
  ToastController 
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
    IonText
  ]
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  public isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Getter de conveniencia para acceder a los controles en la plantilla (como en el dossier)
  get f() {
    return this.loginForm.controls;
  }

  public async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); // Fuerza la visualizacion de errores
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: async (usuario) => {
        this.isSubmitting = false;

        if (usuario) {
          const toast = await this.toastController.create({
            message: `Bienvenido, ${usuario.nombre}`,
            duration: 2000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();

          // Redirección según rol
          if (usuario.rol === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/usuarios']);
          }
        } else {
          await this.mostrarErrorToast('Credenciales incorrectas. Revisa el correo y la contraseña.');
        }
      },
      error: async () => {
        this.isSubmitting = false;
        await this.mostrarErrorToast('Error de conexión con el servicio de autenticación.');
      }
    });
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