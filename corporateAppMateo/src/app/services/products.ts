import { Injectable } from '@angular/core';
import { Product } from '../app.component';

const fallbackProducts: Product[] = [
  {
    id: 1,
    nombre: 'Portátil Dell',
    unidades: 12,
    precio: 1200,
    foto: 'assets/icon/favicon.png',
  },
  {
    id: 2,
    nombre: 'Monitor LG',
    unidades: 8,
    precio: 299,
    foto: 'assets/icon/favicon.png',
  },
];

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  async getProducts(): Promise<Product[]> {
    try {
      const response = await fetch('/assets/data/product.json');
      if (!response.ok) {
        return fallbackProducts;
      }

      const data = await response.json();
      return Array.isArray(data) && data.length ? data : fallbackProducts;
    } catch (error) {
      console.error('Error cargando productos:', error);
      return fallbackProducts;
    }
  }
}