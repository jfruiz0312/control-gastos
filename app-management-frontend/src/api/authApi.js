import { api } from './axiosConfig';
import { extractItem } from '../utils/api';

export async function iniciarSesion(payload) {
  const response = await api.post('/auth/login', payload, {
    meta: {
      skipAuth: true,
      showError: false,
      skipAuthRedirect: true,
    },
  });

  return extractItem(response.data);
}
