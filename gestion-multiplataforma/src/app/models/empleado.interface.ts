export interface Empleado {
  id: number;           // int8 (auto-increment)
  created_at?: string;  // timestamptz
  nombre: string;       // text
  email: string;        // text
  edad: number;         // int8
  salario: number;      // numeric / float8
  activo: boolean;      // boolean
  rol: 'Admin' | 'User';// text
}