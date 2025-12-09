import React from 'react';
import { Segmented } from 'antd';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale.reducer';

const LanguageToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);
  const themeMode = useAppSelector(state => state.theme.actualTheme);
  const isDark = themeMode === 'dark';

  const handleChange = (value: string | number) => {
    const newLocale = value as string;
    dispatch(setLocale(newLocale));
    i18n.changeLanguage(newLocale);
  };

  return (
    <Segmented
      value={currentLocale}
      onChange={handleChange}
      options={[
        {
          label: (
            <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🇬🇧</span>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>EN</span>
            </div>
          ),
          value: 'en',
        },
        {
          label: (
            <div style={{ padding: '4px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
              <span>🇻🇳</span>
              <span style={{ fontSize: '13px', fontWeight: 500 }}>VI</span>
            </div>
          ),
          value: 'vi',
        },
      ]}
      style={{
        backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
        borderRadius: '8px',
        padding: '3px',
        boxShadow: isDark ? 'inset 0 1px 3px rgba(0,0,0,0.3)' : 'inset 0 1px 3px rgba(0,0,0,0.08)',
      }}
    />
  );
};

export default LanguageToggle;
