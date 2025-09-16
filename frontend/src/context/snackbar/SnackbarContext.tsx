import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type SnackbarType = 'success' | 'error' | 'info';

interface SnackbarState {
  message: string;
  type: SnackbarType;
  open: boolean;
}

interface SnackbarContextType {
  showSnackbar: (message: string, type?: SnackbarType) => void;
  snackbar: SnackbarState;
  setSnackbar: React.Dispatch<React.SetStateAction<SnackbarState>>;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

interface SnackbarProviderProps {
  children: ReactNode;
}

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    message: '',
    type: 'info',
    open: false,
  });

  const showSnackbar = useCallback((message: string, type: SnackbarType = 'info') => {
    setSnackbar({ message, type, open: true });
    setTimeout(() => {
      setSnackbar((prev) => ({ ...prev, open: false }));
    }, 3000); 
  }, []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar, snackbar, setSnackbar }}>
      {children}
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};
