export const Colors = {
  // Primary palette - Teal and Blue
  primary: '#14B8A6', // Teal-500
  primaryDark: '#0F766E', // Teal-700
  primaryLight: '#5EEAD4', // Teal-300
  
  secondary: '#0EA5E9', // Sky-500
  secondaryDark: '#0369A1', // Sky-700
  secondaryLight: '#7DD3FC', // Sky-300
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#F8FAFC', // Slate-50
  card: '#FFFFFF',
  
  text: '#1E293B', // Slate-800
  textSecondary: '#64748B', // Slate-500
  textLight: '#94A3B8', // Slate-400
  
  border: '#E2E8F0', // Slate-200
  divider: '#F1F5F9', // Slate-100
  
  // Status colors
  success: '#10B981', // Emerald-500
  warning: '#F59E0B', // Amber-500
  error: '#EF4444', // Red-500
  info: '#3B82F6', // Blue-500
  
  // Special colors
  critical: '#DC2626', // Red-600 - for critical medical alerts
  active: '#10B981', // Emerald-500
  suspended: '#F59E0B', // Amber-500
  lost: '#EF4444', // Red-500
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    lineHeight: 36,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: 'normal' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: 'normal' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: 'normal' as const,
    lineHeight: 16,
  },
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};
