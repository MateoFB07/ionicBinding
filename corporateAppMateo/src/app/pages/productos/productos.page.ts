import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { Product } from '../../app.component';
import { ProductsService } from '../../services/products';

@Component({
  selector: 'app-productos',
  standalone: true,
  templateUrl: './productos.page.html',
  styleUrls: ['./productos.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonGrid,
    IonRow,
    IonCol,
    CommonModule,
    FormsModule,
  ],
})
export class ProductosPage implements OnInit {
  private readonly productService = inject(ProductsService);

  products: Product[] = [
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

  async ngOnInit() {
    const data = await this.productService.getProducts();
    this.products = data.length ? data : this.products;
  }

}
