import { alpha, createTheme } from '@mui/material/styles';

export function buildTheme(mode = 'light') {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#009688',
      },
      background: {
        default: isDark ? '#0f172a' : '#f5f7fb',
        paper: isDark ? '#162033' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
      },
      h5: {
        fontWeight: 700,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: 'blur(12px)',
            backgroundColor: alpha(isDark ? '#0f172a' : '#ffffff', 0.82),
            color: isDark ? '#f8fafc' : '#0f172a',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            border: `1px solid ${alpha(isDark ? '#cbd5e1' : '#1e293b', 0.08)}`,
            boxShadow: isDark
              ? '0 10px 30px rgba(15, 23, 42, 0.35)'
              : '0 10px 30px rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            borderRight: 0,
          },
        },
      },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 0,
          },
          columnHeaders: {
            fontWeight: 700,
          },
        },
      },
    },
  });
}
