import { produtos, categorias } from '../selecao-de-achados/src/data/produtos.js';

const API_URL = process.env.API_URL || 'http://localhost:8080';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

let authToken = null;

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Erro ${response.status}: ${text}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

async function login() {
  const data = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: ADMIN_EMAIL, senha: ADMIN_PASSWORD }),
  });
  authToken = data.token;
}

async function buscarCategoriasExistentes() {
  return request('/api/categorias');
}

async function criarCategoria(categoria) {
  return request('/api/admin/categorias', {
    method: 'POST',
    body: JSON.stringify({
      slug: categoria.slug,
      nome: categoria.label,
      icone: categoria.icone,
      ordem: 0,
      ativo: true,
    }),
  });
}

async function criarProduto(produto, categoriaId) {
  return request('/api/admin/produtos', {
    method: 'POST',
    body: JSON.stringify({
      nome: produto.nome,
      categoriaId,
      chamada: produto.chamada,
      badge: produto.badge,
      imagem: produto.imagem,
      linkAfiliado: produto.link,
      ativo: true,
      ordem: produto.id,
    }),
  });
}

async function main() {
  console.log(`Importando produtos para ${API_URL}...`);

  await login();
  console.log('Login realizado com sucesso.\n');

  const categoriasExistentes = await buscarCategoriasExistentes();
  const mapaCategorias = {};

  for (const c of categoriasExistentes) {
    mapaCategorias[c.slug] = c.id;
  }

  for (const c of categorias) {
    if (!mapaCategorias[c.slug]) {
      console.log(`Criando categoria: ${c.slug}`);
      const criada = await criarCategoria(c);
      mapaCategorias[criada.slug] = criada.id;
    }
  }

  let importados = 0;
  let erros = 0;

  for (const p of produtos) {
    const categoriaId = mapaCategorias[p.categoria];
    if (!categoriaId) {
      console.warn(`Categoria não encontrada para ${p.nome}: ${p.categoria}`);
      erros++;
      continue;
    }

    try {
      await criarProduto(p, categoriaId);
      importados++;
      console.log(`✓ ${p.nome}`);
    } catch (e) {
      console.error(`✗ Erro ao importar ${p.nome}:`, e.message);
      erros++;
    }
  }

  console.log(`\nImportação finalizada: ${importados} importados, ${erros} erros.`);
}

main().catch((e) => {
  console.error('Erro na importação:', e.message);
  process.exit(1);
});
