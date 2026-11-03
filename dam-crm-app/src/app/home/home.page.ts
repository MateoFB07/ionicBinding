import { Component, OnInit, inject } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular';
import { SupabaseService } from '../services/supabase';
import { Proveedor } from '../models/proveedor.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel],
})
export class HomePage implements OnInit {
  private supabaseService = inject(SupabaseService);
  proveedores: Proveedor [] = [];  // Hace la importación de la línea 4.
  constructor() {}
  ngOnInit(): void {
    void this.gOnInit();
  }
  async gOnInit(): Promise<void> {
    this.proveedores = (await this.supabaseService.getProveedores()) ?? [];
  }
}