import * as Types from '../../types';

export interface AppState {
  tasks: Types.Task[];
  loadingTasks: boolean;
  tasksError: string | null;
  categories: Types.Category[];
  loadingCategories: boolean;
  categoriesError: string | null;
}

export type AppAction = 
  | { type: 'FETCH_TASKS_START' }
  | { type: 'FETCH_TASKS_SUCCESS', payload: Types.Task[] }
  | { type: 'FETCH_TASKS_ERROR', payload: string }
  | { type: 'ADD_TASK', payload: Types.Task }
  | { type: 'UPDATE_TASK', payload: Types.Task }
  | { type: 'DELETE_TASK', payload: string }
  | { type: 'FETCH_CATEGORIES_START' }
  | { type: 'FETCH_CATEGORIES_SUCCESS', payload: Types.Category[] }
  | { type: 'FETCH_CATEGORIES_ERROR', payload: string }
  | { type: 'ADD_CATEGORY', payload: Types.Category }
  | { type: 'UPDATE_CATEGORY', payload: Types.Category }
  | { type: 'DELETE_CATEGORY', payload: string };

export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'FETCH_TASKS_START':
      return { ...state, loadingTasks: true, tasksError: null };
    case 'FETCH_TASKS_SUCCESS':
      return { ...state, loadingTasks: false, tasks: action.payload };
    case 'FETCH_TASKS_ERROR':
      return { ...state, loadingTasks: false, tasksError: action.payload };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
      };
    case 'FETCH_CATEGORIES_START':
      return { ...state, loadingCategories: true, categoriesError: null };
    case 'FETCH_CATEGORIES_SUCCESS':
      return { ...state, loadingCategories: false, categories: action.payload };
    case 'FETCH_CATEGORIES_ERROR':
      return { ...state, loadingCategories: false, categoriesError: action.payload };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(category => 
          category.id === action.payload.id ? action.payload : category
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(category => category.id !== action.payload),
      };
    default:
      return state;
  }
};
