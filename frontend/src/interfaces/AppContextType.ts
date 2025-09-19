import * as Types from '../types';
import type { CreateCategoryPayload } from '../hooks/useCategories';

export interface AppContextType {
  tasks: Types.Task[];
  loadingTasks: boolean;
  tasksError: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (data: Types.CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, data: Types.UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompleted: (id: string) => Promise<void>;

  categories: Types.Category[];
  loadingCategories: boolean;
  categoriesError: string | null;

  fetchCategories: () => Promise<void>;
  createCategory: (data: CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: string, data: Types.CreateCategoryPayload) => Promise<void>; 
  deleteCategory: (id: string) => Promise<void>;

}
