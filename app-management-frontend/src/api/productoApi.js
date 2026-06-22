import { api } from './axiosConfig';
import { extractCollection, extractItem } from '../utils/api';

export async function obtenerProductos() {
  const response = await api.get('/productos');
  return extractCollection(response.data, ['productos']);
}

export async function obtenerProductosStockBajo() {
  const response = await api.get('/productos/stock-bajo');
  return extractCollection(response.data, ['productos']);
}

export async function obtenerProducto(id) {
  const response = await api.get(`/productos/${id}`);
  return extractItem(response.data, ['producto']);
}

export async function crearProducto(payload) {
  const response = await api.post('/productos', payload);
  return extractItem(response.data, ['producto']);
}

export async function actualizarProducto(id, payload) {
  const response = await api.put(`/productos/${id}`, payload);
  return extractItem(response.data, ['producto']);
}

export async function eliminarProducto(id) {
  return api.delete(`/productos/${id}`);
}
