import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { setLocale } from 'app/shared/reducers/locale.reducer';

const LanguageSwitch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLocale = useAppSelector(state => state.locale.currentLocale);

  const handleToggle = () => {
    const newLocale = currentLocale === 'en' ? 'vi' : 'en';
    dispatch(setLocale(newLocale));
    i18n.changeLanguage(newLocale);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="language-switch-btn"
      title={currentLocale === 'en' ? 'Switch to Vietnamese' : 'Chuyển sang tiếng Anh'}
    >
      {currentLocale === 'en' ? (
        <>
          <span className="flag">🇻🇳</span>
          <span className="lang-text">VI</span>
        </>
      ) : (
        <>
          <span className="flag">🇬🇧</span>
          <span className="lang-text">EN</span>
        </>
      )}
    </button>
  );
};

export default LanguageSwitch;
