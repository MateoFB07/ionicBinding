import { Injectable } from '@angular/core';
import { Usuario } from './usuario';

@Injectable({
    providedIn: 'root'
})
export class Servicio {
    private users : Usuario[] = [
        { id: 1, nombre: 'Juan', email: 'juan@example.com', activo: true },
        { id: 2, nombre: 'María', email: 'maria@example.com', activo: true },
        { id: 3, nombre: 'Pedro', email: 'pedro@example.com', activo: true },
    ];
    public getUsuarios(): Promise<Usuario[]> {
        return Promise.resolve(this.users);
    }
}
