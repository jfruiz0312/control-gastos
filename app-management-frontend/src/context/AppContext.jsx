import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildTheme } from '../theme';
import { registerHttpHandlers } from '../api/axiosConfig';
import { getErrorMessage } from '../utils/api';

const AppContext = createContext(null);

const getInitialMode = () => {
  const storedMode = window.localStorage.getItem('app-color-mode');
  return storedMode || 'light';
};

export function AppProvider({ children }) {
  const [mode, setMode] = useState(getInitialMode);
  const [loadingCount, setLoadingCount] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    window.localStorage.setItem('app-color-mode', mode);
  }, [mode]);

  const showSnackbar = useCallback((message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((previousState) => ({
      ...previousState,
      open: false,
    }));
  }, []);

  useEffect(() => {
    const unregister = registerHttpHandlers({
      onRequestStart: (config) => {
        if (config?.meta?.showLoader === false) {
          return;
        }

        setLoadingCount((currentValue) => currentValue + 1);
      },
      onRequestEnd: (config) => {
        if (config?.meta?.showLoader === false) {
          return;
        }

        setLoadingCount((currentValue) => Math.max(0, currentValue - 1));
      },
      onError: (error, config) => {
        if (config?.meta?.showError === false) {
          return;
        }

        showSnackbar(getErrorMessage(error), 'error');
      },
    });

    return unregister;
  }, [showSnackbar]);

  const value = useMemo(
    () => ({
      mode,
      theme: buildTheme(mode),
      loading: loadingCount > 0,
      snackbar,
      setMode,
      toggleColorMode: () => setMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light')),
      showSnackbar,
      closeSnackbar,
    }),
    [loadingCount, mode, snackbar, showSnackbar, closeSnackbar],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext debe utilizarse dentro de AppProvider');
  }

  return context;
}
