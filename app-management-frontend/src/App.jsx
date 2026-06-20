import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import AppRoutes from './routes/AppRoutes';
import { AppProvider, useAppContext } from './context/AppContext';
import GlobalLoader from './components/common/GlobalLoader';
import AppSnackbar from './components/common/AppSnackbar';

function AppShell() {
  const { theme, loading, snackbar, closeSnackbar } = useAppContext();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <CssBaseline />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
        <GlobalLoader open={loading} />
        <AppSnackbar snackbar={snackbar} onClose={closeSnackbar} />
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
