/**
 * LANGLEAGUE DESIGN SYSTEM - GROWTH & ENERGY THEME
 * Duolingo-inspired with Dark Mode Support
 *
 * ⚠️ IMPORTANT: Colors use CSS Variables from app.scss
 * This ensures Dark Mode works correctly!
 */

import { CSSProperties } from 'react';

// ============================================
// 1. COLORS - Mapped to CSS Variables
// ============================================
export const colors = {
  // Brand Colors (Static - don't change in dark mode)
  primary: {
    DEFAULT: '#58CC02',
    hover: '#46A302',
    light: '#D7FFB8',
    shadow: '#46A302',
    gradient: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
  },

  secondary: {
    DEFAULT: '#FFC800',
    hover: '#E5B400',
    shadow: '#D6A800',
    gradient: 'linear-gradient(135deg, #FFC800 0%, #FFB000 100%)',
  },

  // Semantic colors (static)
  success: '#58CC02',
  error: '#FF4B4B',
  warning: '#FFC800',
  info: '#1CB0F6',

  // Role colors
  user: {
    gradient: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
    solid: '#58CC02',
  },
  staff: {
    gradient: 'linear-gradient(135deg, #FFC800 0%, #FFB000 100%)',
    solid: '#FFC800',
  },
  admin: {
    gradient: 'linear-gradient(135deg, #1CB0F6 0%, #0E8FD6 100%)',
    solid: '#1CB0F6',
  },

  // Level colors
  beginner: '#58CC02',
  intermediate: '#FFC800',
  advanced: '#FF4B4B',

  // ⭐ Dynamic Colors - USE CSS VARIABLES FOR DARK MODE
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    disabled: 'var(--text-disabled)',
    white: 'var(--text-white)',
  },

  background: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
  },

  border: {
    light: 'var(--border-light)',
    default: 'var(--border-color)',
  },
};

// ============================================
// 2. SPACING (8px base)
// ============================================
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '40px',
  xxxl: '48px',
};

// ============================================
// 3. TYPOGRAPHY - Nunito Font
// ============================================
export const typography = {
  fontFamily: "'Nunito', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",

  fontSize: {
    xs: '12px',
    sm: '13px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// ============================================
// 4. SHADOWS - CSS Variables + 3D Buttons
// ============================================
export const shadows = {
  // ⭐ Dynamic shadows (use CSS variables)
  xs: 'var(--shadow-xs)',
  sm: 'var(--shadow-sm)',
  md: 'var(--shadow-md)',
  lg: 'var(--shadow-lg)',
  card: 'var(--shadow-card)',

  // 3D Button shadows (static)
  btnPrimary: '0 4px 0 #46A302',
  btnSecondary: '0 4px 0 #D6A800',
  btnError: '0 4px 0 #EA2B2B',
  btnInfo: '0 4px 0 #0E8FD6',

  // Hover shadows
  cardHover: '0 4px 12px rgba(0, 0, 0, 0.1)',

  // Role shadows
  primary: '0 4px 12px rgba(88, 204, 2, 0.2)',
  staff: '0 4px 12px rgba(255, 200, 0, 0.2)',
  admin: '0 4px 12px rgba(28, 176, 246, 0.2)',
};

// ============================================
// 5. BORDER RADIUS - Friendly & Rounded
// ============================================
export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  xxl: '24px',
  full: '9999px',
};

// ============================================
// 6. LAYOUT CONSTANTS
// ============================================
export const layout = {
  containerWidth: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },

  pagePadding: {
    mobile: spacing.md,
    tablet: spacing.lg,
    desktop: spacing.lg,
  },

  headerHeight: '64px',

  cardGutter: {
    mobile: 16,
    tablet: 16,
    desktop: 24,
  },
};

// ============================================
// 7. COMPONENT STYLES
// ============================================

// Page Container
export const pageContainerStyle: CSSProperties = {
  padding: layout.pagePadding.desktop,
  background: colors.background.secondary,
  minHeight: '100vh',
  fontFamily: typography.fontFamily,
  color: colors.text.primary,
};

// Card Base Style
export const cardBaseStyle: CSSProperties = {
  background: colors.background.primary,
  borderRadius: borderRadius.xl,
  border: `2px solid ${colors.border.light}`,
  boxShadow: shadows.card,
  transition: 'all 0.3s ease',
};

// 3D Button Styles
export const buttonStyles = {
  primary: {
    background: colors.primary.DEFAULT,
    color: colors.text.white,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borderRadius.xl,
    border: 'none',
    boxShadow: shadows.btnPrimary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },

  secondary: {
    background: colors.secondary.DEFAULT,
    color: colors.text.primary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borderRadius.xl,
    border: 'none',
    boxShadow: shadows.btnSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    cursor: 'pointer',
    transition: 'all 0.1s ease',
  },
};

// Input Style
export const inputStyle: CSSProperties = {
  width: '100%',
  padding: spacing.md,
  borderRadius: borderRadius.lg,
  fontSize: typography.fontSize.md,
  background: colors.background.secondary,
  border: `2px solid ${colors.border.default}`,
  color: colors.text.primary,
  transition: 'all 0.2s ease',
};

// Progress Bar Style
export const progressBarStyle = {
  container: {
    width: '100%',
    background: colors.border.default,
    borderRadius: borderRadius.full,
    height: '16px',
    overflow: 'hidden' as const,
    position: 'relative' as const,
  },

  bar: {
    background: colors.primary.gradient,
    height: '100%',
    borderRadius: borderRadius.full,
    transition: 'width 0.5s ease',
    position: 'relative' as const,
  },
};

// Header Banner (per role)
export const headerBannerStyle = {
  user: {
    background: colors.user.gradient,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    border: 'none',
    boxShadow: shadows.primary,
    padding: spacing.xxl,
    color: colors.text.white,
  },
  staff: {
    background: colors.staff.gradient,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    border: 'none',
    boxShadow: shadows.staff,
    padding: spacing.xxl,
    color: colors.text.white,
  },
  admin: {
    background: colors.admin.gradient,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    border: 'none',
    boxShadow: shadows.admin,
    padding: spacing.xxl,
    color: colors.text.white,
  },
};

// Stats Card Style
export const statsCardStyle: CSSProperties = {
  ...cardBaseStyle,
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
};

// Icon Circle Style
export const iconCircleStyle: CSSProperties = {
  width: '64px',
  height: '64px',
  borderRadius: borderRadius.full,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: `0 auto ${spacing.md}`,
  background: 'rgba(255, 255, 255, 0.2)',
  backdropFilter: 'blur(10px)',
};

// ============================================
// 8. UTILITY FUNCTIONS
// ============================================

export const getLevelColor = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER':
      return colors.beginner;
    case 'INTERMEDIATE':
      return colors.intermediate;
    case 'ADVANCED':
      return colors.advanced;
    default:
      return colors.info;
  }
};

export const getLevelText = (level: string): string => {
  switch (level?.toUpperCase()) {
    case 'BEGINNER':
      return 'Cơ bản';
    case 'INTERMEDIATE':
      return 'Trung cấp';
    case 'ADVANCED':
      return 'Nâng cao';
    default:
      return level;
  }
};

export const getRoleHeaderConfig = (role: 'user' | 'staff' | 'admin') => {
  const configs = {
    user: {
      ...headerBannerStyle.user,
      icon: '🎓',
      title: 'User Dashboard',
    },
    staff: {
      ...headerBannerStyle.staff,
      icon: '📚',
      title: 'Staff Dashboard',
    },
    admin: {
      ...headerBannerStyle.admin,
      icon: '📊',
      title: 'Admin Dashboard',
    },
  };

  return configs[role];
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};
