import api from './api';

export async function listarCategorias() {
  const response = await api.get('/api/categorias');
  return response.data;
}

export async function criarCategoria(categoria) {
  const response = await api.post('/api/admin/categorias', categoria);
  return response.data;
}

export async function atualizarCategoria(id, categoria) {
  const response = await api.put(`/api/admin/categorias/${id}`, categoria);
  return response.data;
}

export async function deletarCategoria(id) {
  await api.delete(`/api/admin/categorias/${id}`);
}
