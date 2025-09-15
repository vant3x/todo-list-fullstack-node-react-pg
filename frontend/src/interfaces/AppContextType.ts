export interface AppContextType {
  showSnackbar: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  // Add other app-wide context properties if necessary
}
