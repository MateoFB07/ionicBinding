import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonSpinner,
  IonTitle,
  IonToolbar,
  ToastController
} from '@ionic/angular';
import { NavegacionComponent } from '../../components/navegacion/navegacion.component';
import { Empleado } from '../../models/empleado.interface';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.page.html',
  styleUrls: ['./informes.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonSpinner,
    RouterLink,
    NavegacionComponent
  ]
})
export class InformesPage {
  public empleados = signal<Empleado[]>([]);
  public cargando = signal(true);

  private readonly authService = inject(AuthService);
  private readonly toastController = inject(ToastController);

  async ionViewWillEnter(): Promise<void> {
    this.cargando.set(true);
    try {
      this.empleados.set(await this.authService.getEmpleados());
    } catch (error) {
      console.error('Error al cargar los empleados para los informes:', error);
      await this.mostrarToast('No se pudieron cargar los datos para exportar', 'danger');
    } finally {
      this.cargando.set(false);
    }
  }

  async exportarPdf(): Promise<void> {
    const ventana = window.open('', '_blank');
    if (!ventana) {
      await this.mostrarToast('Permite las ventanas emergentes para exportar el PDF', 'danger');
      return;
    }

    const fecha = new Date();
    const filas = this.empleados().map((empleado) => `
      <tr>
        <td>${this.escaparHtml(empleado.nombre)}</td>
        <td>${this.escaparHtml(empleado.email)}</td>
        <td>${empleado.edad}</td>
        <td>${new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(empleado.salario)}</td>
        <td>${empleado.rol === 'Admin' ? 'Administrador' : 'Usuario'}</td>
        <td>${empleado.activo ? 'Activo' : 'Inactivo'}</td>
      </tr>
    `).join('');

    ventana.document.open();
    ventana.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8">
          <title>usuarios-${fecha.toISOString().slice(0, 10)}</title>
          <style>
            body { color: #172033; font: 14px Arial, sans-serif; margin: 32px; }
            h1 { margin-bottom: 4px; }
            p { color: #526078; margin-top: 0; }
            table { border-collapse: collapse; margin-top: 24px; width: 100%; }
            th, td { border: 1px solid #cbd5e1; padding: 9px; text-align: left; }
            th { background: #eef2ff; }
            @media print { body { margin: 12mm; } }
          </style>
        </head>
        <body>
          <h1>Listado de usuarios</h1>
          <p>Generado el ${fecha.toLocaleDateString('es-ES')}</p>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo electrónico</th>
                <th>Edad</th>
                <th>Salario mensual</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>${filas}</tbody>
          </table>
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.focus();
    ventana.print();
  }

  async exportarCsv(): Promise<void> {
    const encabezados = ['Nombre', 'Correo electrónico', 'Edad', 'Salario mensual', 'Rol', 'Estado'];
    const filas = this.empleados().map((empleado) => [
      this.escaparCsv(empleado.nombre),
      this.escaparCsv(empleado.email),
      empleado.edad,
      empleado.salario,
      this.escaparCsv(empleado.rol === 'Admin' ? 'Administrador' : 'Usuario'),
      this.escaparCsv(empleado.activo ? 'Activo' : 'Inactivo')
    ]);
    const contenido = [encabezados.map((valor) => this.escaparCsv(valor)), ...filas]
      .map((fila) => fila.join(';'))
      .join('\r\n');
    const archivo = new Blob(['\uFEFF', contenido], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(archivo);
    const enlace = document.createElement('a');
    enlace.href = url;
    enlace.download = `usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    URL.revokeObjectURL(url);
  }

  private escaparCsv(valor: string): string {
    const textoSeguro = /^[\s]*[=+\-@]/.test(valor) ? `'${valor}` : valor;
    return `"${textoSeguro.replace(/"/g, '""')}"`;
  }

  private escaparHtml(valor: string): string {
    return valor.replace(/[&<>"']/g, (caracter) => {
      const entidades: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return entidades[caracter];
    });
  }

  private async mostrarToast(mensaje: string, color: 'danger' | 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2500,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
