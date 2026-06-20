import { api } from './axiosConfig';
import { extractCollection, extractItem } from '../utils/api';

export async function obtenerReporteGanancias() {
  const response = await api.get('/reportes/ganancias');
  return extractItem(response.data, ['ganancias']);
}

export async function obtenerReporteInventario() {
  const response = await api.get('/reportes/inventario');
  return extractCollection(response.data, ['inventario']);
}

export async function obtenerReporteVentas() {
  const response = await api.get('/reportes/ventas');
  return extractCollection(response.data, ['ventas']);
}
