/**
 * Theme constants - Định nghĩa màu sắc và style thống nhất cho toàn dự án
 */

// ==================== COLORS ====================
export const COLORS = {
  primary: '#667eea',
  primaryDark: '#081edf',
  primaryLight: '#764ba2',

  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',

  text: {
    primary: '#262626',
    secondary: '#595959',
    disabled: '#bfbfbf',
  },

  background: {
    default: '#f0f2f5',
    white: '#ffffff',
    light: '#fafafa',
    dark: '#001529',
  },

  border: {
    default: '#d9d9d9',
    light: '#f0f0f0',
  },
} as const;

// ==================== GRADIENTS ====================
export const GRADIENTS = {
  primary: 'linear-gradient(180deg, #667eea 0%, #081edfff 100%)',
  primaryHorizontal: 'linear-gradient(90deg, #667eea 0%, #7308dfff 100%)',
  card: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
