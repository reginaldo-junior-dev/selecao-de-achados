import api from './api';

export async function registrarClique(produtoId) {
  await api.post(`/api/cliques/${produtoId}`);
}
