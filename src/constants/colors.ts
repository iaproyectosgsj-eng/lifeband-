// Color palette and shared design tokens for the UI.
export const Colors = {
  teal: '#0F766E',
  blue: '#2563EB',
  bg: '#F8FAFC',
  surface: '#FFFFFF',
  text: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  error: '#DC2626',
  errorBorder: '#FCA5A5',
  primary: '#0F766E',
  primaryDark: '#0F766E',
  primaryLight: '#5EEAD4',
  secondary: '#2563EB',
  secondaryDark: '#1D4ED8',
  secondaryLight: '#93C5FD',
  background: '#F8FAFC',
  card: '#FFFFFF',
  textSecondary: '#64748B',
  textLight: '#94A3B8',
  divider: '#E2E8F0',
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  critical: '#DC2626',
  active: '#10B981',
  suspended: '#F59E0B',
  lost: '#DC2626',
  overlay: 'rgba(15, 23, 42, 0.25)',
  shadow: 'rgba(15, 23, 42, 0.08)',
};

// Standard spacing scale (in dp).
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography presets for consistent text styling.
export const Typography = {
  title: {
    fontSize: 30,
    fontWeight: '700' as const,
    lineHeight: 38,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  subheading: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

// Border radius scale used across components.
export const BorderRadius = {
  sm: 12,
  md: 20,
  lg: 24,
  xl: 28,
  full: 9999,
};
