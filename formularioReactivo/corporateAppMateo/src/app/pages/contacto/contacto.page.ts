import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonInput, IonTextarea, IonButton, IonList, IonLabel, IonNote,
} from '@ionic/angular';
import { MessagesService, Mensaje } from '../../services/messages.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.page.html',
  standalone: true,
  imports: [
    DatePipe, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonInput, IonTextarea, IonButton, IonList, IonLabel, IonNote,
  ],
})
export class ContactoPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly messages = inject(MessagesService);
  mensajes: Mensaje[] = [];

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    mensaje: ['', [Validators.required, Validators.minLength(5)]],
  });

  async ngOnInit() {
    this.mensajes = await this.messages.getMensajes();
  }

  async enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, mensaje } = this.form.getRawValue();
    await this.messages.addMensaje(email, mensaje);
    this.mensajes = await this.messages.getMensajes();
    this.form.reset();
  }

  async borrar() {
    await this.messages.borrarTodos();
    this.mensajes = [];
  }
}