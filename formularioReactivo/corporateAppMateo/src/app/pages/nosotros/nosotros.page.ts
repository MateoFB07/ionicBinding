import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular';
import { GeolocationService } from '../../services/geolocation-service';

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.page.html',
  styleUrls: ['./nosotros.page.scss'],
  imports: [CommonModule, FormsModule, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle]
})
export class NosotrosPage implements OnInit {
  distancia = signal<number | null>(null);
  errorUbicacion = signal<string | null>(null);
  solicitandoUbicacion = signal(false);

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {
    void this.actualizarUbicacion();
  }

  async actualizarUbicacion() {
    if (this.solicitandoUbicacion()) {
      return;
    }

    this.solicitandoUbicacion.set(true);
    this.errorUbicacion.set(null);
    this.distancia.set(null);

    try {
      const position = await this.geolocationService.getCurrentPosition();
      this.distancia.set(this.geolocationService.calcularDistancia(
        position.latitude,
        position.longitude,
        this.geolocationService.oficinaLat,
        this.geolocationService.oficinaLon
      ));
    } catch (error) {
      this.errorUbicacion.set(error instanceof Error
        ? error.message
        : 'No se pudo obtener la ubicación del dispositivo.');
    } finally {
      this.solicitandoUbicacion.set(false);
    }
  }
}