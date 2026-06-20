import { api } from './axiosConfig';
import { extractCollection, extractItem } from '../utils/api';

export async function obtenerCompras() {
  const response = await api.get('/compras');
  return extractCollection(response.data, ['compras']);
}

export async function registrarCompra(payload) {
  const response = await api.post('/compras', payload);
  return extractItem(response.data, ['compra']);
}
