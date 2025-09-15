export interface User {
  id: string;
  email: string;
  name: string;
  creado_en: string;
  actualizado_en: string;
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
  name: string;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  creado_en: string;
  actualizado_en: string;
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
  creado_en: string;
  actualizado_en: string;
}

export type Priority = 'BAJA' | 'MEDIA' | 'ALTA';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  userId: string;
  categoryId?: string;
  creado_en: string;
  actualizado_en: string;
  category?: Category;
  tags?: Tag[];
}
