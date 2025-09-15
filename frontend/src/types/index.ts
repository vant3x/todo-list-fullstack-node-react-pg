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
  nombre: string; // Changed from name
  usuario_id: string; // Changed from userId
  creado_en: string; // Changed from createdAt
  actualizado_en: string; // Changed from updatedAt
}

export interface Tag {
  id: string;
  nombre: string; // Changed from name
  usuario_id: string; // Changed from userId
  creado_en: string; // Changed from createdAt
  actualizado_en: string; // Changed from updatedAt
}

export enum Priority {
  LOW = 0,
  MEDIUM = 1,
  HIGH = 2,
}

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