import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layouts/MainLayout';

const Dashboard = lazy(() => import('../pages/Dashboard'));
const Productos = lazy(() => import('../pages/Productos'));
const Compras = lazy(() => import('../pages/Compras'));
const Ventas = lazy(() => import('../pages/Ventas'));
const Gastos = lazy(() => import('../pages/Gastos'));
const Inventario = lazy(() => import('../pages/Inventario'));
const Reportes = lazy(() => import('../pages/Reportes'));

function RouteFallback() {
  return (
    <Box sx={{ minHeight: 320, display: 'grid', placeItems: 'center' }}>
      <CircularProgress />
    </Box>
  );
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="productos" element={<Productos />} />
          <Route path="compras" element={<Compras />} />
          <Route path="ventas" element={<Ventas />} />
          <Route path="gastos" element={<Gastos />} />
          <Route path="inventario" element={<Inventario />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
