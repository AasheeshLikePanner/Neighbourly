const designSystem = {
  colors: {
    primary: {
      blue: '#2563eb',
      cyan: '#06b6d4',
      purple: '#7c3aed',
      indigo: '#4f46e5'
    },
    secondary: {
      amber: '#f59e0b',
      orange: '#ea580c',
      green: '#059669',
      emerald: '#10b981',
      pink: '#ec4899',
      red: '#dc2626'
    },
    neutral: {
      gray50: '#f9fafb',
      gray100: '#f3f4f6',
      gray200: '#e5e7eb',
      gray300: '#d1d5db',
      gray400: '#9ca3af',
      gray500: '#6b7280',
      gray600: '#4b5563',
      gray700: '#374151',
      gray800: '#1f2937',
      gray900: '#111827'
    },
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6'
    }
  },
  gradients: {
    primary: 'from-blue-600 to-cyan-600',
    secondary: 'from-purple-600 to-pink-600',
    accent: 'from-amber-500 to-orange-500',
    success: 'from-green-500 to-emerald-500',
    background: 'from-slate-50 via-blue-50/30 to-indigo-50/20',
    glass: 'from-white/70 to-white/50',
    brand: 'from-blue-600 via-purple-600 to-cyan-600'
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800'
    }
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    base: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  },
  borderRadius: {
    sm: '0.5rem',
    base: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px'
  },
  shadows: {
    sm: 'shadow-sm',
    base: 'shadow-lg shadow-gray-200/20',
    lg: 'shadow-xl shadow-gray-200/30',
    colored: 'shadow-lg shadow-blue-200/50',
    glow: 'shadow-2xl shadow-blue-300/40'
  }
};

export default designSystem;
