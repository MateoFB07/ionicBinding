import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSearchbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, 
  IonCardTitle, IonCardSubtitle, IonCardContent, IonBadge, IonButton 
} from '@ionic/angular';
import { Empleado } from '../../models/empleado.interface';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla.usuario.component.html',
  standalone: true,
  imports: [
    CommonModule, CurrencyPipe, FormsModule, IonSearchbar, IonGrid, 
    IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonBadge, IonButton
  ]
})
export class TablaUsuariosComponent {
  // Props / Inputs desde el padre
  @Input({ required: true }) datos: Empleado[] = [];
  @Input() esAdmin: boolean = false;

  // Output hacia el padre al solicitar eliminar un registro
  @Output() alEliminar = new EventEmitter<number>();

  public textoBusqueda: string = '';

  // Getter reactivo para filtrar datos en tiempo real sin modificar la lista original
  get datosFiltrados(): Empleado[] {
    if (!this.textoBusqueda.trim()) {
      return this.datos;
    }
    const query = this.textoBusqueda.toLowerCase();
    return this.datos.filter(emp => 
      emp.nombre.toLowerCase().includes(query) || 
      emp.email.toLowerCase().includes(query) ||
      (emp.rol && emp.rol.toLowerCase().includes(query))
    );
  }

  solicitarEliminacion(id: number): void {
    this.alEliminar.emit(id);
  }
}