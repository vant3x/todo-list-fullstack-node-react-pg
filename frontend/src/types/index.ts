export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  nombre: string;
}

export interface Category {
  id: string;
  nombre: string;
  usuario_id: string;
  creado_en: string;
  actualizado_en: string;
}

export interface Tag {
  id: string;
  nombre: string;
  usuario_id: string;
  creado_en: string;
  actualizado_en: string;
}

export type Priority = 'BAJA' | 'MEDIA' | 'ALTA';

export const Priority = {
  BAJA: 'BAJA' as Priority,
  MEDIA: 'MEDIA' as Priority,
  ALTA: 'ALTA' as Priority,
};

export interface Task {
  id: string;
  titulo: string;
  descripcion?: string;
  completada: boolean;
  prioridad: Priority;
  fecha_vencimiento?: string;
  usuario_id: string;
  categoria_id?: string;
  creado_en: string;
  actualizado_en: string;
  completado_en?: string;
  categoria?: Category;
  etiquetas?: Tag[];
}

export interface CreateTaskPayload {
  titulo: string;
  descripcion?: string;
  prioridad?: Priority;
  fecha_vencimiento?: string;
  categoria_id?: string;
  tagNames?: string[];
}

export interface UpdateTaskPayload {
  titulo?: string;
  descripcion?: string;
  completada?: boolean;
  prioridad?: Priority;
  fecha_vencimiento?: string;
  categoria_id?: string;
  tagNames?: string[];
}

export interface CreateCategoryPayload {
  nombre: string;
}

export interface TaskFilters {
  completada?: boolean;
  categoria?: string;
  prioridad?: Types.Prioridad;
  busqueda?: string;
  etiquetas?: string[];
  ordenar?: 'creado_en' | 'fecha_vencimiento' | 'prioridad' | 'titulo';
  direccion?: 'asc' | 'desc';
}