import type { Components } from '@mui/material/styles';

export const components: Components = {
  MuiCssBaseline: {
    styleOverrides: {
      body: {
        fontFamily: '"Arimo", sans-serif',
        margin: 0,
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      '::-webkit-scrollbar': {
        width: 8,
        height: 8,
      },
      '::-webkit-scrollbar-track': {
        background: '#f8f9fa',
      },
      '::-webkit-scrollbar-thumb': {
        background: '#c2c6d0',
        borderRadius: 4,
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: '#737780',
      },
    },
  },

  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        padding: '10px 24px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
        },
      },
      outlined: {
        borderWidth: 2,
        '&:hover': {
          borderWidth: 2,
        },
      },
      sizeSmall: {
        padding: '6px 16px',
      },
    },
    variants: [
      {
        props: { variant: 'contained', color: 'primary' },
        style: {
          '&:hover': {
            backgroundColor: '#00284d',
          },
        },
      },
      {
        props: { variant: 'outlined', color: 'secondary' },
        style: {
          borderWidth: 2,
          borderColor: '#333333',
          color: '#333333',
          '&:hover': {
            borderWidth: 2,
            borderColor: '#333333',
            backgroundColor: 'rgba(51, 51, 51, 0.04)',
          },
        },
      },
    ],
  },

  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 12,
        border: '1px solid #e1e3e4',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
        '&:hover': {
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },

  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        '& fieldset': {
          borderColor: '#c2c6d0',
        },
        '&:hover fieldset': {
          borderColor: '#737780',
        },
        '&.Mui-focused fieldset': {
          borderWidth: 2,
          borderColor: '#003865',
        },
      },
    },
  },

  MuiInputLabel: {
    styleOverrides: {
      root: {
        fontSize: '0.875rem',
        fontWeight: 600,
        letterSpacing: '0.01em',
        '&.Mui-focused': {
          color: '#003865',
        },
      },
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {},
    },
  },

  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        fontWeight: 500,
        fontSize: '0.75rem',
        height: 28,
      },
    },
    variants: [
      {
        props: { variant: 'filled', color: 'primary' },
        style: {
          backgroundColor: '#d2e4ff',
          color: '#001c37',
          border: '1px solid #a1c9ff',
        },
      },
      {
        props: { variant: 'filled', color: 'secondary' },
        style: {
          backgroundColor: '#e4e2e1',
          color: '#1b1c1c',
        },
      },
      {
        props: { variant: 'filled', color: 'success' },
        style: {
          backgroundColor: '#e6f4ea',
          color: '#1e7e34',
          border: '1px solid rgba(40, 167, 69, 0.2)',
        },
      },
      {
        props: { variant: 'filled', color: 'warning' },
        style: {
          backgroundColor: '#fff3cd',
          color: '#856404',
        },
      },
      {
        props: { variant: 'filled', color: 'error' },
        style: {
          backgroundColor: '#ffdad6',
          color: '#93000a',
        },
      },
      {
        props: { variant: 'filled', color: 'info' },
        style: {
          backgroundColor: '#d2e4ff',
          color: '#001c37',
          border: '1px solid #a1c9ff',
        },
      },
    ],
  },

  MuiTableCell: {
    styleOverrides: {
      head: {
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#42474f',
        backgroundColor: '#f3f4f5',
        borderBottom: '1px solid #e1e3e4',
        padding: '24px 24px',
      },
      root: {
        fontSize: '1rem',
        fontWeight: 400,
        color: '#191c1d',
        borderBottom: '1px solid #e1e3e4',
        padding: '24px 24px',
      },
    },
  },

  MuiTableRow: {
    styleOverrides: {
      root: {
        '&:hover': {
          backgroundColor: '#f3f4f5',
        },
      },
    },
  },

  MuiAppBar: {
    styleOverrides: {
      root: {
        backgroundColor: '#ffffff',
        borderTop: '4px solid #003865',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
      },
    },
  },

  MuiDrawer: {
    styleOverrides: {
      paper: {
        backgroundColor: '#f3f4f5',
        borderRight: '1px solid #e1e3e4',
      },
    },
  },

  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: 12,
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
      },
    },
  },
};
