import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import { Usuario } from '../usuario';
import { Servicio } from '../servicio';

@Component({
  selector: 'app-galeria',
  standalone: true,
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.scss'],
  imports: [CommonModule, IonHeader, IonContent, IonItem, IonLabel, IonList, IonTitle, IonToolbar],
})
export class GaleriaComponent implements OnInit {
  public tituloSeccion: string = 'Galería de Imágenes Dinámicas';
  public descripcionSeccion: string = 'Esta galería muestra imágenes de manera dinámica utilizando Angular.';
  public rutaImagenLocal: string = 'assets/imagen1.jpeg';

  public users: Usuario[] = [
    { id: 1, nombre: 'Juan', email: 'juan@example.com', activo: true },
    { id: 2, nombre: 'María', email: 'maria@example.com', activo: true },
    { id: 3, nombre: 'Pedro', email: 'pedro@example.com', activo: true },
  ];

  constructor(private usersService: Servicio) {}

  ngOnInit(): void {
    this.usersService.getUsuarios().then((usuarios) => {
      this.users = usuarios;
    });
  }
}
