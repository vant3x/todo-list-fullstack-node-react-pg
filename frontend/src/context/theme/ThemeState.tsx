import React, { useReducer, useEffect } from 'react';
import ThemeContext from './ThemeContext';
import { themeReducer } from './ThemeReducer';
import type { ThemeState as ThemeReducerState } from './ThemeReducer';
import { TOGGLE_THEME } from './types';

interface ThemeStateProps {
  children: React.ReactNode;
}

const ThemeState: React.FC<ThemeStateProps> = ({ children }) => {
  const getInitialTheme = (): ThemeReducerState => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return { theme: storedTheme };
    }
    const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
    return { theme: userMedia.matches ? 'dark' : 'light' };
  };

  const [state, dispatch] = useReducer(themeReducer, getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state.theme);
    localStorage.setItem('theme', state.theme);
  }, [state.theme]);

  const toggleTheme = () => {
    dispatch({ type: TOGGLE_THEME });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: state.theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeState;
