import type { TypographyVariantsOptions } from '@mui/material/styles';

export const typography: TypographyVariantsOptions = {
  fontFamily: '"Arimo", sans-serif',
  h1: {
    fontSize: '3rem',
    fontWeight: 700,
    lineHeight: 56 / 48,
    letterSpacing: '-0.02em',
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 700,
    lineHeight: 40 / 32,
  },
  h3: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 32 / 24,
  },
  h4: {
    fontSize: '1.125rem',
    fontWeight: 400,
    lineHeight: 28 / 18,
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 24 / 16,
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 20 / 14,
    letterSpacing: '0.01em',
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 500,
    lineHeight: 16 / 12,
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 600,
    lineHeight: 20 / 14,
    letterSpacing: '0.01em',
    textTransform: 'none',
  },
};
