import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Usuario } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuariosMock: Usuario[] = [
    { id: 1, nombre: 'Mateo Fernández', email: 'admin@test.com', rol: 'Admin' },
    { id: 2, nombre: 'Ana Gómez', email: 'ana@test.com', rol: 'User' },
    { id: 3, nombre: 'Carlos Ruiz', email: 'carlos@test.com', rol: 'User' },
    { id: 4, nombre: 'Laura Martín', email: 'laura@test.com', rol: 'Admin' }
  ];

  constructor() {}

  public login(email: string, pass: string): Observable<Usuario | null> {
    const user = this.usuariosMock.find(u => u.email === email);
    return of(user || null);
  }

  public getUsuarios(): Observable<Usuario[]> {
    return of(this.usuariosMock);
  }
}