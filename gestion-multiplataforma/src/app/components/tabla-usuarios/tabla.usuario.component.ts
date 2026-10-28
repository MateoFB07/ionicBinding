import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonSearchbar,
  IonBadge,
  IonButton,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';
import { Empleado } from '../../models/empleado.interface';

type ColumnaOrden = 'nombre' | 'email' | 'edad' | 'salario' | 'rol' | 'activo';
type DireccionOrden = 'asc' | 'desc';

@Component({
  selector: 'app-tabla-usuarios',
  templateUrl: './tabla.usuario.component.html',
  styleUrls: ['./tabla.usuario.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    IonSearchbar,
    IonBadge,
    IonButton,
    IonSelect,
    IonSelectOption
  ]
})
export class TablaUsuariosComponent {
  @Input({ required: true }) datos: Empleado[] = [];
  @Input() esAdmin = false;

  @Output() alEliminar = new EventEmitter<number>();

  public textoBusqueda = '';
  public filtroRol: 'todos' | 'Admin' | 'User' = 'todos';
  public filtroEstado: 'todos' | 'activo' | 'inactivo' = 'todos';
  public columnaOrden: ColumnaOrden = 'nombre';
  public direccionOrden: DireccionOrden = 'asc';

  get datosFiltrados(): Empleado[] {
    const query = this.textoBusqueda.trim().toLocaleLowerCase('es');

    return this.datos
      .filter((empleado) => {
        const coincideBusqueda = !query
          || empleado.nombre.toLocaleLowerCase('es').includes(query)
          || empleado.email.toLocaleLowerCase('es').includes(query)
          || empleado.rol.toLocaleLowerCase('es').includes(query);
        const coincideRol = this.filtroRol === 'todos' || empleado.rol === this.filtroRol;
        const coincideEstado = this.filtroEstado === 'todos'
          || empleado.activo === (this.filtroEstado === 'activo');

        return coincideBusqueda && coincideRol && coincideEstado;
      })
      .sort((a, b) => this.comparar(a, b));
  }

  ordenarPor(columna: ColumnaOrden): void {
    if (this.columnaOrden === columna) {
      this.direccionOrden = this.direccionOrden === 'asc' ? 'desc' : 'asc';
      return;
    }

    this.columnaOrden = columna;
    this.direccionOrden = 'asc';
  }

  indicadorOrden(columna: ColumnaOrden): string {
    if (this.columnaOrden !== columna) {
      return '↕';
    }
    return this.direccionOrden === 'asc' ? '↑' : '↓';
  }

  private comparar(a: Empleado, b: Empleado): number {
    const valorA = a[this.columnaOrden];
    const valorB = b[this.columnaOrden];
    let comparacion: number;

    if (typeof valorA === 'number' && typeof valorB === 'number') {
      comparacion = valorA - valorB;
    } else if (typeof valorA === 'boolean' && typeof valorB === 'boolean') {
      comparacion = Number(valorA) - Number(valorB);
    } else {
      comparacion = String(valorA).localeCompare(String(valorB), 'es', {
        sensitivity: 'base'
      });
    }

    return this.direccionOrden === 'asc' ? comparacion : -comparacion;
  }

  solicitarEliminacion(id: number): void {
    this.alEliminar.emit(id);
  }
}