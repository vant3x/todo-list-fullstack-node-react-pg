import { TOGGLE_THEME } from './types';
import type { Theme } from './types/theme';

type ThemeAction = { type: typeof TOGGLE_THEME };
export interface ThemeState {
  theme: Theme;
}

export const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === 'light' ? 'dark' : 'light',
      };
    default:
      return state;
  }
};
