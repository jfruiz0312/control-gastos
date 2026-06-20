import { api } from './axiosConfig';
import { extractCollection, extractItem } from '../utils/api';

export async function obtenerGastos() {
  const response = await api.get('/gastos');
  return extractCollection(response.data, ['gastos']);
}

export async function registrarGasto(payload) {
  const response = await api.post('/gastos', payload);
  return extractItem(response.data, ['gasto']);
}

export async function actualizarGasto(id, payload) {
  const response = await api.put(`/gastos/${id}`, payload);
  return extractItem(response.data, ['gasto']);
}

export async function eliminarGasto(id) {
  return api.delete(`/gastos/${id}`);
}
