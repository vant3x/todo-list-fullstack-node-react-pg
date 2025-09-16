import * as Types from '../types';

export interface AppContextType {
  // Task State
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
  createCategory: (data: Types.CreateCategoryPayload) => Promise<void>;
  updateCategory: (id: string, data: Types.CreateCategoryPayload) => Promise<void>; 
  deleteCategory: (id: string) => Promise<void>;

  showSnackbar: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}
