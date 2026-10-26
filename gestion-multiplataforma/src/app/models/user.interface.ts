export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'Admin' | 'User';
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
}