import { Component, computed, effect, signal, ChangeDetectionStrategy } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonBadge } from '@ionic/angular';

// Interfaz para el tipado de datos
export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
}

@Component({
  selector: 'app-carrito-signals',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonBadge],
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    ion-toolbar,
    ion-badge {
      --background: chartreuse;
      --color: black;
    }

    .add-product-button {
      --background: chartreuse;
      --color: black;
    }
  `],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Carrito Reactivo</ion-title>
        <ion-badge slot="end" class="ion-margin-end">
          Total: {{ precioTotal() }}€
        </ion-badge>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        @for (prod of productos(); track prod.id) {
          <ion-item>
            <ion-label>
              <h2>{{ prod.nombre }}</h2>
              <p>{{ prod.categoria }} · {{ prod.precio }}€</p>
            </ion-label>
            <ion-button fill="clear" (click)="eliminarProducto(prod.id)">
              Eliminar
            </ion-button>
          </ion-item>
        } @empty {
          <ion-item>
            <ion-label class="ion-text-center">El carrito está vacío</ion-label>
          </ion-item>
        }
      </ion-list>

      <div class="ion-padding">
        <ion-button class="add-product-button" expand="block" (click)="agregarProductoAleatorio()">
          Añadir Producto Random
        </ion-button>
      </div>
    </ion-content>
  `
})
export class CarritoSignalsComponent {
  // 1. Estado Writable
  public productos = signal<Producto[]>([
    { id: 1, nombre: 'Licencia IDE', categoria: 'Software', precio: 89 },
    { id: 2, nombre: 'Teclado Mecánico', categoria: 'Periféricos', precio: 120 },
    { id: 3, nombre: 'Windows 11', categoria: 'Software', precio: 120 }
  ]);

  // 2. Estado Derivado (Computed)
  public precioTotal = computed(() => {
    return this.productos().reduce((total, prod) => total + prod.precio, 0);
  });

  constructor() {
    console.log('Carmelo, el crack');

    // 3. Efecto Secundario (Effect)
    effect(() => {
      console.log(`Carrito actualizado: hay ${this.productos().length} productos en el carrito.`);
    });
  }

  public agregarProductoAleatorio(): void {
    const nuevoId = Math.floor(Math.random() * 1000) + 3;
    const categorias = ['Periféricos', 'Software', 'Accesorios', 'Hardware'];
    const categoriaAleatoria = categorias[Math.floor(Math.random() * categorias.length)];
    const nuevoProducto: Producto = {
      id: nuevoId,
      nombre: `Monitor ${nuevoId}`,
      categoria: categoriaAleatoria,
      precio: 250
    };
    this.productos.update(estadoAnterior => [...estadoAnterior, nuevoProducto]);
  }

  public eliminarProducto(id: number): void {
    this.productos.update(estadoAnterior => estadoAnterior.filter(p => p.id !== id));
  }
}``