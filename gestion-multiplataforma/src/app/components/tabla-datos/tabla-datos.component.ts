import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-datos',
  templateUrl: './tabla-datos.component.html',
  styleUrls: ['./tabla-datos.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TablaDatosComponent {
  // Recibimos la lista de datos y las cabeceras desde la pagina padre
  @Input() listaDatos: any[] = [];
  @Input() columnas: string[] = [];

  // Eventos para avisar al padre cuando se pulsa una fila o el boton de borrar
  @Output() seleccionar = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();

  constructor() {}

  clickFila(item: any) {
    console.log('Fila pulsada:', item);
    this.seleccionar.emit(item);
  }

  clickBorrar(event: Event, item: any) {
    event.stopPropagation(); // Para que no salte el click de la fila entera
    this.borrar.emit(item);
  }
}