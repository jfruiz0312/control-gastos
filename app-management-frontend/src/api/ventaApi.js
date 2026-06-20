import { api } from './axiosConfig';
import { extractCollection, extractItem } from '../utils/api';

export async function obtenerVentas() {
  const response = await api.get('/ventas');
  return extractCollection(response.data, ['ventas']);
}

export async function registrarVenta(payload) {
  const response = await api.post('/ventas', payload);
  return extractItem(response.data, ['venta']);
}
