import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

export interface Mensaje {
  email: string;
  mensaje: string;
  fecha: string;
}

@Injectable({ providedIn: 'root' })
export class MessagesService {
  private readonly KEY = 'mensajes';

  async getMensajes(): Promise<Mensaje[]> {
    const { value } = await Preferences.get({ key: this.KEY });
    return value ? JSON.parse(value) : [];
  }

  async addMensaje(email: string, mensaje: string): Promise<void> {
    const lista = await this.getMensajes();
    lista.unshift({ email, mensaje, fecha: new Date().toISOString() });
    await Preferences.set({ key: this.KEY, value: JSON.stringify(lista) });
  }

  async borrarTodos(): Promise<void> {
    await Preferences.remove({ key: this.KEY });
  }
}