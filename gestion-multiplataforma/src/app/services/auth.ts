import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';
import { Empleado } from '../models/empleado.interface';
import { Usuario } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: Usuario | null = null;

  constructor() {
    const sesion = localStorage.getItem('usuario_sesion');
    if (sesion) {
      this.usuarioActual = JSON.parse(sesion);
    }
  }

  /**
   * Autentica al usuario comprobando correo y la columna 'contraseña' en Supabase.
   */
  public async login(email: string, pass: string): Promise<Usuario | null> {
    const emailLimpio = email.trim().toLowerCase();
    const passLimpia = pass;

    // Consulta directa a la columna 'contraseña' en la tabla 'empleados'
    const { data, error } = await supabase
      .from('empleados')
      .select('id, nombre, email, rol')
      .ilike('email', emailLimpio)
      .eq('contraseña', passLimpia)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar en Supabase:', error);
      throw error;
    }

    if (!data) {
      console.warn('Credenciales incorrectas: email o contraseña no coincidentes.');
      return null;
    }

    const usuario: Usuario = {
      id: data.id,
      nombre: data.nombre,
      email: data.email,
      rol: data.rol || 'User'
    };

    this.usuarioActual = usuario;
    localStorage.setItem('usuario_sesion', JSON.stringify(usuario));
    return usuario;
  }

  /**
   * Obtiene la lista completa de empleados desde Supabase.
   */
  public async getEmpleados(): Promise<Empleado[]> {
    const { data, error } = await supabase
      .from('empleados')
      .select('id, created_at, nombre, email, edad, salario, activo, rol')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }

    return data as Empleado[];
  }

  /**
   * Crea un nuevo empleado en la base de datos.
   */
  public async crearEmpleado(nuevo: Omit<Empleado, 'id' | 'created_at'>): Promise<Empleado> {
    const { data, error } = await supabase
      .from('empleados')
      .insert([nuevo])
      .select()
      .single();

    if (error) {
      console.error('Error al insertar empleado:', error);
      throw error;
    }

    return data as Empleado;
  }

  /**
   * Elimina un empleado por su ID.
   */
  public async eliminarEmpleado(id: number): Promise<void> {
    const { error } = await supabase
      .from('empleados')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar empleado:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  public logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario_sesion');
  }

  /**
   * Comprueba si hay una sesión de usuario guardada.
   */
  public isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }

  /**
   * Devuelve el rol del usuario actual.
   */
  public getRol(): string | null {
    return this.usuarioActual?.rol ?? null;
  }
}