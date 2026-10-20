import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StoreProduct } from '../models/store.product.model';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  // Inyección moderna de dependencias en Angular
  private http = inject(HttpClient);
  
  // Endpoint de Fake Store API según la plantilla oficial de la práctica
  private apiUrl = 'https://fakestoreapi.com/products';

  getStoreProducts(): Observable<StoreProduct[]> {
    return this.http.get<StoreProduct[]>(this.apiUrl);
  }
}