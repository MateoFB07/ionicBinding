import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/angular';
import { Product, ProductsResponse } from '../../models/product.model';
import { ProductService } from '../../services/producto.services';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButton
  ]
})
export class ProductosPage implements OnInit {
  private productService = inject(ProductService);
  private changeDetector = inject(ChangeDetectorRef);

  products: Product[] = [];
  total = 0;

  // Punto 7: Paginación. Configuración y estado de la página actual.
  readonly pageSize = 10;
  currentPage = 0;
  error = '';
  loading = false;

  // Punto 7: Paginación. Calcula el número total de páginas y el rango visible.
  get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  get firstProductNumber(): number {
    return this.total === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get lastProductNumber(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.total);
  }

  // Punto 6: cuenta las categorías distintas para la tarjeta de resumen.
  get categoryCount(): number {
    return new Set(this.products.map(product => product.category)).size;
  }

  // Punto 6: calcula el precio medio para la tarjeta de resumen.
  get averagePrice(): number {
    if (this.products.length === 0) {
      return 0;
    }

    return this.products.reduce((sum, product) => sum + product.price, 0) / this.products.length;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    // Reinicia el estado antes de solicitar los productos.
    this.error = '';
    this.loading = true;

    // Punto 7: Paginación. Calcula cuántos productos omitir para esta página.
    const skip = this.currentPage * this.pageSize;

    this.productService.getProducts(this.pageSize, skip).subscribe({
      next: (response: ProductsResponse) => {
        this.products = response.products;
        this.total = response.total;
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: (err: unknown) => {
        console.error(err);
        this.error = 'No se han podido cargar los productos.';
        this.loading = false;
        this.changeDetector.markForCheck(); // Se refresca automáticamente para mostrar.
      }
    });
  }

  // Punto 7: Paginación. Carga la página anterior cuando es posible.
  previousPage(): void {
    if (this.currentPage > 0 && !this.loading) {
      this.currentPage--;
      this.loadProducts();
    }
  }

  // Punto 7: Paginación. Carga la página siguiente cuando quedan páginas.
  nextPage(): void {
    if (this.currentPage < this.totalPages - 1 && !this.loading) {
      this.currentPage++;
      this.loadProducts();
    }
  }
}