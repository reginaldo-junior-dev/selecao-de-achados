import api from './api';

export async function listarProdutos(params = {}) {
  const { categoria, busca, page = 0, size = 16, sort = 'ordem,asc' } = params;
  const response = await api.get('/api/produtos', {
    params: { categoria, busca, page, size, sort },
  });
  return response.data;
}

export async function listarProdutosAdmin(params = {}) {
  const { categoria, busca, page = 0, size = 16, sort = 'ordem,asc' } = params;
  const response = await api.get('/api/admin/produtos', {
    params: { categoria, busca, page, size, sort },
  });
  return response.data;
}

export async function buscarProdutoPorId(id) {
  const response = await api.get(`/api/produtos/${id}`);
  return response.data;
}

export async function criarProduto(produto) {
  const response = await api.post('/api/admin/produtos', produto);
  return response.data;
}

export async function atualizarProduto(id, produto) {
  const response = await api.put(`/api/admin/produtos/${id}`, produto);
  return response.data;
}

export async function deletarProduto(id) {
  await api.delete(`/api/admin/produtos/${id}`);
}
