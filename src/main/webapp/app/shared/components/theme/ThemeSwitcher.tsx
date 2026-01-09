import React from 'react';
import { useTheme } from 'app/shared/context/ThemeContext';
import { ThemeMode } from 'app/shared/model/enumerations/enums.model';
import './ThemeSwitcher.scss';

interface ThemeSwitcherProps {
  showLabels?: boolean;
  orientation?: 'horizontal' | 'vertical';
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ showLabels = false, orientation = 'horizontal' }) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`theme-switcher ${orientation}`}>
      {showLabels && <label className="theme-label">Theme:</label>}

      <div className="theme-options">
        <button
          className={`theme-option ${theme === ThemeMode.LIGHT ? 'active' : ''}`}
          onClick={() => setTheme(ThemeMode.LIGHT)}
          title="Light Mode"
          aria-label="Switch to light mode"
        >
          <i className="bi bi-sun-fill"></i>
          {showLabels && <span>Light</span>}
        </button>

        <button
          className={`theme-option ${theme === ThemeMode.DARK ? 'active' : ''}`}
          onClick={() => setTheme(ThemeMode.DARK)}
          title="Dark Mode"
          aria-label="Switch to dark mode"
        >
          <i className="bi bi-moon-fill"></i>
          {showLabels && <span>Dark</span>}
        </button>

        <button
          className={`theme-option ${theme === ThemeMode.SYSTEM ? 'active' : ''}`}
          onClick={() => setTheme(ThemeMode.SYSTEM)}
          title="System Theme"
          aria-label="Use system theme"
        >
          <i className="bi bi-circle-half"></i>
          {showLabels && <span>System</span>}
        </button>
      </div>
    </div>
  );
};

export default ThemeSwitcher;
