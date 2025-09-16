import { createContext } from 'react';
import type { Theme } from './types/theme';

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({} as ThemeContextProps);

export default ThemeContext;
