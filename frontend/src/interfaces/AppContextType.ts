export interface AppContextType {
  showSnackbar: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
}
