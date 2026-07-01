import api from './api';

export async function login(email, senha) {
  const response = await api.post('/api/auth/login', { email, senha });
  return response.data;
}
