import { useContext } from 'react';
import AuthContext from '../context/auth/AuthContext'; // Import the new AuthContext
import type { AuthContextType } from '../interfaces/AuthContextType';

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthState provider');
  }
  return context;
};

export default useAuth;
