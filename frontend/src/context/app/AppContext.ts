import { createContext } from 'react';
import type { AppContextType } from '../../interfaces/AppContextType';

const AppContext = createContext<AppContextType | undefined>(undefined);

export default AppContext;
