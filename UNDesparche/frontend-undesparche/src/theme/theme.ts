import { createTheme } from '@mui/material/styles';
import { palette } from './palette';
import { typography } from './typography';
import { shadows } from './shadows';
import { components } from './components';

export const theme = createTheme({
  palette,
  typography,
  shadows,
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components,
});
