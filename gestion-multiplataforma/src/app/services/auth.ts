import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Guardamos el usuario logueado
  private usuarioSubject = new BehaviorSubject<any>(null);
  public usuario$ = this.usuarioSubject.asObservable();

  constructor() {
    // Si ya habia sesion en el navegador, la cargamos
    const sesionGuardada = localStorage.getItem('sesion_usuario');
    if (sesionGuardada) {
      this.usuarioSubject.next(JSON.parse(sesionGuardada));
    }
  }

  // Metodo para comprobar credenciales
  login(email: string, pass: string): Observable<any> {
    console.log('Intentando login con:', email);
    let usuario = null;

    if (email === 'admin@test.com' && pass === 'admin123') {
      usuario = { email: email, rol: 'Admin', nombre: 'Administrador' };
    } else if (email === 'user@test.com' && pass === 'user123') {
      usuario = { email: email, rol: 'User', nombre: 'Usuario Estándar' };
    }

    if (usuario) {
      localStorage.setItem('sesion_usuario', JSON.stringify(usuario));
      this.usuarioSubject.next(usuario);
    }

    return of(usuario).pipe(delay(400));
  }

  // Comprobar si el email existe en la BD
  comprobarEmail(email: string): Observable<boolean> {
    const listaEmails = ['admin@test.com', 'user@test.com', 'prueba@test.com'];
    const existe = listaEmails.includes(email.toLowerCase());
    return of(existe).pipe(delay(600));
  }

  logout() {
    localStorage.removeItem('sesion_usuario');
    this.usuarioSubject.next(null);
  }

  getRol(): string | null {
    return this.usuarioSubject.value ? this.usuarioSubject.value.rol : null;
  }

  estaLogueado(): boolean {
    return this.usuarioSubject.value !== null;
  }
}