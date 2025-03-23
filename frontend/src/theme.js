// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#c8e3ea',
    },
    secondary: {
      main: '#B6D9E2',
    },
    success: {
      main: '#00CD85',
    },
    error: {
      main: '#e12528',
    },
    warning: {
      main: '#ffb040',
    },
    background: {
      default: '#e6f4ed',
    },
  },
});

export default theme;
