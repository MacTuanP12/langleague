import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LocaleState {
  currentLocale: string;
}

const initialState: LocaleState = {
  currentLocale: localStorage.getItem('locale') || 'en',
};

const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state.currentLocale = action.payload;
      localStorage.setItem('locale', action.payload);
      // Sync with i18next - dynamic import to avoid circular dependency
      import('../../config/i18n-loader').then(({ default: i18n }) => {
        i18n.changeLanguage(action.payload);
      });
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
