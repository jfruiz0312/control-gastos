import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'mui-grid-vendor': ['@mui/x-data-grid'],
          'mui-chart-vendor': ['@mui/x-charts'],
          'mui-date-vendor': ['@mui/x-date-pickers'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'yup', 'dayjs'],
          'http-vendor': ['axios'],
        },
      },
    },
  },
});
