import { Injectable } from '@angular/core';
import { Empleado } from '../models/empleado.interface';
import { Usuario } from '../models/user.interface';
import { supabase } from './supabase.client';

export type NuevoEmpleado = Omit<Empleado, 'id' | 'created_at'>;

export class PerfilEmpleadoNoEncontradoError extends Error {
  constructor(public readonly email: string) {
    super(`Supabase Auth ha validado ${email}, pero no hay un perfil visible con ese correo en public.empleados.`);
    this.name = 'PerfilEmpleadoNoEncontradoError';
  }
}

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
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailLimpio,
      password: pass
    });

    if (authError) {
      if (authError.code === 'invalid_credentials' || authError.code === 'user_not_found') {
        return null;
      }
      console.error('Error al autenticar con Supabase Auth:', authError);
      throw authError;
    }

    const emailAutenticado = authData.user.email;
    if (!emailAutenticado) {
      await this.cerrarSesionAuth();
      throw new Error('La cuenta autenticada no tiene un correo electrónico.');
    }

    const { data: perfil, error: perfilError } = await supabase
      .from('empleados')
      .select('id, nombre, email, rol')
      .ilike('email', emailAutenticado)
      .maybeSingle();

    if (perfilError) {
      await this.cerrarSesionAuth();
      console.error('Error al consultar el perfil del empleado:', perfilError);
      throw perfilError;
    }

    if (!perfil) {
      await this.cerrarSesionAuth();
      throw new PerfilEmpleadoNoEncontradoError(emailAutenticado);
    }

    const usuario: Usuario = {
      id: perfil.id,
      nombre: perfil.nombre,
      email: perfil.email,
      rol: perfil.rol === 'Admin' ? 'Admin' : 'User'
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
    if (this.getRol() !== 'Admin') {
      throw new Error('Solo los administradores pueden insertar empleados.');
    }

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

  public async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    this.usuarioActual = null;
    localStorage.removeItem('usuario_sesion');
    if (error) {
      console.error('Error al cerrar la sesión de Supabase Auth:', error);
      throw error;
    }
  }

  public isAuthenticated(): boolean {
    return this.usuarioActual !== null;
  }

  public getRol(): string | null {
    return this.usuarioActual?.rol ?? null;
  }

  private async cerrarSesionAuth(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('No se pudo limpiar la sesión de Supabase Auth:', error);
      throw error;
    }
  }
}
