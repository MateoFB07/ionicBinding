import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { jsPDF } from 'jspdf';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';

interface DatosRegistro {
  nombre: string;
  email: string;
  fecha: string;
}

function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateNotBeforeToday(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (typeof value !== 'string' || value === '') {
    return null;
  }

  return value < localDateString(new Date()) ? { dateBeforeToday: true } : null;
}

@Component({
  selector: 'app-registro',
  templateUrl: 'registro.page.html',
  styleUrls: ['registro.page.scss'],
  host: {
    '[class.dark-mode]': 'isDarkMode()',
  },
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonContent,
    IonHeader,
    IonInput,
    IonItem,
    IonList,
    IonSpinner,
    IonTitle,
    IonToolbar,
  ],
})
export class RegistroPage {
  private fb = inject(FormBuilder);
  private alertController = inject(AlertController);
  public get today(): string {
    return localDateString(new Date());
  }
  // Definición del formulario reactivo fuertemente tipado
  public registroForm: FormGroup;
  // Uso de Signals (visto en sesiones anteriores) para gestionar el estado de envío
  public isSubmitting = signal<boolean>(false);
  public isDarkMode = signal<boolean>(false);
  public submittedData = signal<DatosRegistro | null>(null);
  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
      // Patrón: Mínimo 8 caracteres, al menos una letra y un número.
      fecha: ['', [Validators.required, dateNotBeforeToday]],
    });
  }
  public toggleDarkMode(): void {
    this.isDarkMode.update((darkMode) => !darkMode);
  }
  // Getter de conveniencia para acceder a los controles en la vista
  get f() { return this.registroForm.controls; } // Explicar en el documento.
  public async onSubmit(): Promise<void> {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched(); // Fuerza la visualización de errores
      return;
    }
    this.isSubmitting.set(true);
    try {
      // 9. No guardar ni mostrar la contraseña en consola.
      // 4. Guardar los datos del formulario en localStorage (sin la contraseña).
      const { nombre, email, fecha } = this.registroForm.value;
      const datosFormulario = { nombre, email, fecha };
      localStorage.setItem('registroForm', JSON.stringify(datosFormulario));
      console.log('Datos guardados en localStorage:', localStorage.getItem('registroForm'));
      // Simulación de llamada asíncrona a un backend HTTP
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Aquí se implementaría: this.httpClient.post('url', formData).subscribe(...)
      // 5. Avisar al usuario cuando el formulario se haya enviado correctamente.
      const alert = await this.alertController.create({
        header: 'Formulario enviado',
        message: 'Tus datos se han guardado correctamente.',
        buttons: ['Aceptar'],
      });
      await alert.present();
      this.submittedData.set(datosFormulario);
      this.registroForm.reset();
    } catch (error) {
      console.error('Error al enviar el formulario', error);
    } finally {
      this.isSubmitting.set(false);
    }
  }

  // 7. Crear y descargar un PDF con los datos del último formulario enviado.
  public downloadPdf(): void {
    const datos = this.submittedData();
    if (!datos) {
      return;
    }

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text('Datos del formulario', 20, 20);
    pdf.setFontSize(12);
    pdf.text(`Nombre: ${datos.nombre}`, 20, 35);
    pdf.text(`Correo electronico: ${datos.email}`, 20, 45);
    pdf.text(`Fecha: ${datos.fecha}`, 20, 55);
    pdf.save('datos-formulario.pdf');
  }
}


// Ver por qué "labelPlacement" tiene que aparecer en mayúscula o minúscula?