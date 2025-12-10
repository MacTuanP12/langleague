/**
 * Theme constants - Định nghĩa màu sắc và style thống nhất cho toàn dự án
 * ⚠️ SYNCED WITH design-system.ts
 */

// ==================== COLORS ====================
export const COLORS = {
  // Primary brand colors - SYNCED WITH design-system.ts
  primary: '#58CC02',
  primaryDark: '#46A302',
  primaryLight: '#D7FFB8',
  secondary: '#FFC800',
  secondaryDark: '#E5B400',

  // Semantic colors
  success: '#58CC02',
  successDark: '#46A302',
  warning: '#FFC800',
  warningDark: '#E5B400',
  error: '#FF4B4B',
  errorDark: '#EA2B2B',
  info: '#1CB0F6',
  infoDark: '#0E8FD6',

  // Level colors
  beginner: '#58CC02',
  intermediate: '#FFC800',
  advanced: '#FF4B4B',

  text: {
    primary: '#262626',
    secondary: '#666666',
    disabled: '#bfbfbf',
    white: '#ffffff',
  },

  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#e8e8e8',
    default: '#f5f5f5',
    white: '#ffffff',
    light: '#fafafa',
    dark: '#141414',
  },

  border: {
    default: '#d9d9d9',
    light: '#f0f0f0',
  },
} as const;

// ==================== GRADIENTS ====================
export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
  secondary: 'linear-gradient(135deg, #FFC800 0%, #FFB000 100%)',
  info: 'linear-gradient(135deg, #1CB0F6 0%, #0E8FD6 100%)',
  card: 'linear-gradient(135deg, #58CC02 0%, #46A302 100%)',
} as const;

// ==================== SHADOWS ====================
export const SHADOWS = {
  small: '0 2px 8px rgba(0, 0, 0, 0.06)',
  medium: '0 4px 12px rgba(0, 0, 0, 0.08)',
  large: '0 4px 20px rgba(0, 0, 0, 0.15)',
  primary: '4px 0 20px rgba(102, 126, 234, 0.15)',
} as const;

// ==================== SPACING ====================
export const SPACING = {
  xs: 8,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
} as const;

// ==================== BORDER RADIUS ====================
export const RADIUS = {
  small: 4,
  medium: 8,
  large: 12,
  round: 50,
} as const;

// ==================== LAYOUT DIMENSIONS ====================
export const LAYOUT = {
  sider: {
    collapsed: 80,
    expanded: 280,
  },
  header: {
    height: 72,
  },
  footer: {
    height: 64,
  },
} as const;

// ==================== TRANSITION ====================
export const TRANSITION = {
  default: '0.2s',
  slow: '0.3s',
  fast: '0.1s',
} as const;

// ==================== BREAKPOINTS ====================
export const BREAKPOINTS = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
} as const;

// ==================== Z-INDEX ====================
export const Z_INDEX = {
  dropdown: 1000,
  modal: 1050,
  notification: 1060,
  tooltip: 1070,
  header: 99,
  sider: 100,
} as const;
