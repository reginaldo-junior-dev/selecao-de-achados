import { readFileSync, readdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = join(fileURLToPath(import.meta.url), '..');

const SUPABASE_URL = 'https://rukwbfzwzwpxqbfgocsj.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a3diZnp3endweHFiZmdvY3NqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4ODMzMzksImV4cCI6MjA5ODQ1OTMzOX0.paZ-A2-pVo5X7Ar9cAkxvnZd7BDP52_8s3Ej1twMWgo';
const API_URL = process.env.API_URL || 'http://localhost:8080';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const IMG_DIR = join(__dirname, '..', 'Client', 'public', 'img');
const BUCKET = 'produtos';

if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Defina ADMIN_EMAIL e ADMIN_PASSWORD');
  process.exit(1);
}

async function uploadToSupabase(filePath, fileName) {
  const bytes = readFileSync(filePath);
  const ext = extname(fileName).slice(1);
  const mimeTypes = { jpeg: 'image/jpeg', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif' };
  const contentType = mimeTypes[ext] || 'image/jpeg';

  const cleanName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${cleanName}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': contentType,
    },
    body: bytes,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Falha ao enviar ${fileName}: ${text}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${cleanName}`;
}

async function login() {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, senha: ADMIN_PASSWORD }),
  });
  if (!res.ok) throw new Error('Falha no login');
  return (await res.json()).token;
}

async function getAllProducts(token) {
  const todos = [];
  let page = 0;

  while (true) {
    const res = await fetch(`${API_URL}/api/admin/produtos?page=${page}&size=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao buscar produtos');

    const data = await res.json();
    todos.push(...data.content);

    if (data.last) break;
    page++;
  }

  return todos;
}

async function updateProduct(token, produto) {
  const res = await fetch(`${API_URL}/api/produtos/${produto.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nome: produto.nome,
      categoriaId: produto.categoriaId,
      chamada: produto.chamada,
      badge: produto.badge || '',
      imagem: produto.imagem,
      linkAfiliado: produto.linkAfiliado || '',
      origem: produto.origem,
      ativo: produto.ativo,
      ordem: produto.ordem,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`  Erro ao atualizar #${produto.id}: ${text}`);
    return false;
  }
  return true;
}

async function main() {
  const files = readdirSync(IMG_DIR).filter(f => /\.(jpe?g|png|webp|gif)$/i.test(f));
  console.log(`📁 ${files.length} imagens em public/img/\n`);

  console.log('🔑 Logando...');
  const token = await login();
  console.log('✅ OK\n');

  console.log('📦 Buscando todos os produtos...');
  const produtos = await getAllProducts(token);
  console.log(`✅ ${produtos.length} produtos carregados\n`);

  const paraMigrar = produtos.filter(p => p.imagem && p.imagem.startsWith('/img/'));
  console.log(`🎯 ${paraMigrar.length} produtos com /img/ para migrar\n`);

  let migrados = 0;
  let erros = 0;

  for (const produto of paraMigrar) {
    const nomeArquivo = produto.imagem.replace('/img/', '');
    const caminhoLocal = join(IMG_DIR, nomeArquivo);

    try {
      console.log(`📤 ${nomeArquivo}...`);
      const url = await uploadToSupabase(caminhoLocal, nomeArquivo);
      console.log(`  ✓ Upload OK`);

      produto.imagem = url;
      const ok = await updateProduct(token, produto);

      if (ok) {
        console.log(`  ✓ Produto #${produto.id} atualizado`);
        migrados++;
      } else {
        erros++;
      }
    } catch (e) {
      console.error(`  ✗ ${e.message}`);
      erros++;
    }

    console.log('');
  }

  console.log(`\n✅ Finalizado: ${migrados} migrados, ${erros} erros`);
  if (migrados > 0) console.log('Agora pode apagar a pasta Client/public/img/');
}

main().catch(e => {
  console.error('Erro:', e.message);
  process.exit(1);
});
