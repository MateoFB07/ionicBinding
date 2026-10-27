import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado.interface';
import { Usuario } from '../models/user.interface';
import { supabase } from './supabase.client';

export type NuevoEmpleado = Omit<Empleado, 'id' | 'created_at'> & {
  contraseña: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioActual: Usuario | null = null;

  constructor() {
    const sesion = localStorage.getItem('usuario_sesion');
    if (sesion) {
      this.usuarioActual = JSON.parse(sesion) as Usuario;
    }
  }

  public async login(email: string, pass: string): Promise<Usuario | null> {
    const emailLimpio = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('empleados')
      .select('id, nombre, email, rol')
      .ilike('email', emailLimpio)
      .eq('contraseña', pass)
      .maybeSingle();

    if (error) {
      console.error('Error al consultar credenciales en Supabase:', error);
      throw error;
    }

    if (!data) {
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

  public async existeEmail(email: string): Promise<boolean> {
    const emailLimpio = email.trim().toLowerCase();
    const { data, error } = await supabase
      .from('empleados')
      .select('id')
      .ilike('email', emailLimpio)
      .maybeSingle();

    if (error) {
      console.error('Error al verificar si el correo ya existe:', error);
      throw error;
    }

    return data !== null;
  }

  public async getEmpleados(): Promise<Empleado[]> {
    const { data, error } = await supabase
      .from('empleados')
      .select('id, created_at, nombre, email, edad, salario, activo, rol')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error al obtener empleados:', error);
      throw error;
    }

    return data;
  }

  public async crearEmpleado(nuevo: NuevoEmpleado): Promise<Empleado> {
    const { data, error } = await supabase
      .from('empleados')
      .insert(nuevo)
      .select('id, created_at, nombre, email, edad, salario, activo, rol')
      .single();

    if (error) {
      console.error('Error al insertar empleado:', error);
      throw error;
    }

    return data;
  }

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

  public logout(): void {
    this.usuarioActual = null;
    localStorage.removeItem('usuario_sesion');
  }

  public isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }

  public getRol(): string | null {
    return this.usuarioActual?.rol ?? null;
  }
}
