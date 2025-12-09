import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeState {
  mode: ThemeMode;
  actualTheme: 'light' | 'dark';
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const savedTheme = (localStorage.getItem('theme') as ThemeMode) || 'auto';
const initialActualTheme = savedTheme === 'auto' ? getSystemTheme() : savedTheme;

const initialState: ThemeState = {
  mode: savedTheme,
  actualTheme: initialActualTheme,
};

// Apply theme to document
const applyTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.body.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }
};

// Apply initial theme
applyTheme(initialActualTheme);

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);

      if (action.payload === 'auto') {
        state.actualTheme = getSystemTheme();
      } else {
        state.actualTheme = action.payload;
      }

      applyTheme(state.actualTheme);
    },
    updateSystemTheme(state) {
      if (state.mode === 'auto') {
        state.actualTheme = getSystemTheme();
        applyTheme(state.actualTheme);
      }
    },
  },
});

export const { setTheme, updateSystemTheme } = themeSlice.actions;
export default themeSlice.reducer;

// Listen to system theme changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Dispatch will be handled by component
  });
}
