const officeTheme = {
  colors: {
    primary: '#2C3E50', // dark blue-gray
    secondary: '#18BC9C', // teal
    accent: '#F39C12', // orange
    background: '#ECF0F1', // light gray
    textPrimary: '#2C3E50',
    textSecondary: '#7F8C8D',
    border: '#BDC3C7',
    white: '#FFFFFF',
  },
  fonts: {
    body: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    heading: "'Segoe UI Semibold', Tahoma, Geneva, Verdana, sans-serif",
    mono: "'Courier New', Courier, monospace",
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: '6px',
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.15)',
  },
  button: {
    baseStyle: {
      fontWeight: '600',
      borderRadius: '6px',
      padding: '10px 20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    variants: {
      primary: {
        backgroundColor: '#18BC9C',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#15a589',
        },
        '&:disabled': {
          backgroundColor: '#a0d6cc',
          cursor: 'not-allowed',
        },
      },
      secondary: {
        backgroundColor: '#2C3E50',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#1a2733',
        },
        '&:disabled': {
          backgroundColor: '#7f8c8d',
          cursor: 'not-allowed',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        border: '2px solid #18BC9C',
        color: '#18BC9C',
        '&:hover': {
          backgroundColor: '#18BC9C',
          color: '#FFFFFF',
        },
        '&:disabled': {
          borderColor: '#a0d6cc',
          color: '#a0d6cc',
          cursor: 'not-allowed',
        },
      },
    },
  },
  modal: {
    overlay: {
      backgroundColor: 'rgba(44, 62, 80, 0.8)',
      backdropFilter: 'blur(4px)',
    },
    content: {
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      padding: '24px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    },
    header: {
      fontSize: '1.5rem',
      fontWeight: '700',
      marginBottom: '16px',
      color: '#2C3E50',
    },
    closeButton: {
      color: '#7F8C8D',
      fontSize: '1.25rem',
      cursor: 'pointer',
      '&:hover': {
        color: '#18BC9C',
      },
    },
  },
};

export default officeTheme;
