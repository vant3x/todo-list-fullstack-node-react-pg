import { useContext } from 'react';
import AppContext from '../context/app/AppContext';
import type { AppContextType } from '../interfaces/AppContextType';

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
