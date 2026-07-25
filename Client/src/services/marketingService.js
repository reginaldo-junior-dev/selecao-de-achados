import api from './api';

export async function listarTextosMarketing(produtoId) {
  const response = await api.get(`/api/admin/marketing/produto/${produtoId}`);
  return response.data;
}

export async function criarTextoMarketing(dto) {
  const response = await api.post('/api/admin/marketing', dto);
  return response.data;
}

export async function atualizarTextoMarketing(id, dto) {
  const response = await api.put(`/api/admin/marketing/${id}`, dto);
  return response.data;
}
