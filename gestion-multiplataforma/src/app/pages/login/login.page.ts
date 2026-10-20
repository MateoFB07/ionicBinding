import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
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
    CommonModule,
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit {
  miFormulario!: FormGroup;
  cargando: boolean = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.miFormulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async entrar() {
    if (this.miFormulario.invalid) {
      this.miFormulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const email = this.miFormulario.value.email;
    const pass = this.miFormulario.value.password;

    this.auth.login(email, pass).subscribe({
      next: async (user) => {
        this.cargando = false; // Desbloqueamos siempre el boton al terminar la respuesta

        if (user) {
          const toast = await this.toastCtrl.create({
            message: `Hola de nuevo ${user.nombre}`,
            duration: 2000,
            color: 'success'
          });
          await toast.present();

          if (user.rol === 'Admin') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/usuarios']);
          }
        } else {
          // Si las credenciales fallan
          const toastError = await this.toastCtrl.create({
            message: 'Usuario o contraseña incorrectos',
            duration: 2500,
            color: 'danger'
          });
          await toastError.present();
        }
      },
      error: async () => {
        this.cargando = false; // Si hay error de red, liberamos el boton
        const toastError = await this.toastCtrl.create({
          message: 'Error de conexión con el servicio',
          duration: 2500,
          color: 'danger'
        });
        await toastError.present();
      }
    });
  }
}