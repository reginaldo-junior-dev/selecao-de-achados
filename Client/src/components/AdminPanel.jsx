import { useState, useMemo, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminProductGrid from './AdminProductGrid';
import ProductForm from './ProductForm';
import Pagination from './Pagination';
import Footer from './Footer';
import Toast from './Toast';
import ConfirmDialog from './ConfirmDialog';
import {
  listarProdutosAdmin,
  criarProduto,
  atualizarProduto,
  deletarProduto,
} from '../services/produtoService';
import { listarCategorias } from '../services/categoriaService';
import styles from './AdminPanel.module.css';

const ITENS_POR_PAGINA = 16;

export default function AdminPanel({ onLogout }) {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [formAberto, setFormAberto] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [toast, setToast] = useState(null);
  const [confirmacao, setConfirmacao] = useState(null);

  const categoriasDisponiveis = useMemo(
    () => categorias.filter((c) => c.slug !== 'todos'),
    [categorias]
  );

  const mapaCategoriasPorSlug = useMemo(() => {
    return categoriasDisponiveis.reduce((acc, cat) => {
      acc[cat.slug] = cat;
      return acc;
    }, {});
  }, [categoriasDisponiveis]);

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const data = await listarCategorias();
        const ativas = data.filter((c) => c.ativo);
        setCategorias(ativas);
      } catch {
        setToast({ mensagem: 'Erro ao carregar categorias.', tipo: 'error' });
      }
    }
    carregarCategorias();
  }, []);

  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      try {
        const params = {
          page: paginaAtual - 1,
          size: ITENS_POR_PAGINA,
        };

        if (busca.trim()) {
          params.busca = busca.trim();
        }

        if (categoriaAtiva !== 'todos') {
          params.categoria = categoriaAtiva;
        }

        const data = await listarProdutosAdmin(params);
        setProdutos(data.content);
        setTotalProdutos(data.totalElements);
        setTotalPaginas(data.totalPages);
      } catch (e) {
        if (e.response?.status === 401) {
          onLogout();
        } else {
          setToast({ mensagem: 'Erro ao carregar produtos. Tente novamente.', tipo: 'error' });
        }
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();
  }, [categoriaAtiva, busca, paginaAtual, onLogout]);

  const handleAdicionar = () => {
    setProdutoEditando(null);
    setFormAberto(true);
  };

  const handleEditar = (produto) => {
    setProdutoEditando(produto);
    setFormAberto(true);
  };

  const handleFecharForm = () => {
    setFormAberto(false);
    setProdutoEditando(null);
  };

  const handleSalvar = async (produto) => {
    try {
      const categoria = mapaCategoriasPorSlug[produto.categoria];
      if (!categoria) {
        setToast({ mensagem: 'Categoria inválida.', tipo: 'error' });
        return;
      }

      const payload = {
        nome: produto.nome,
        categoriaId: categoria.id,
        chamada: produto.chamada,
        badge: produto.badge?.trim() || null,
        imagem: produto.imagem,
        linkAfiliado: produto.link,
        origem: produto.origem || 'mercadolivre',
        ativo: produto.ativo ?? true,
        ordem: produto.ordem ?? 0,
      };

      if (produto.id) {
        await atualizarProduto(produto.id, payload);
        setToast({ mensagem: 'Produto atualizado com sucesso!', tipo: 'success' });
      } else {
        await criarProduto(payload);
        setToast({ mensagem: 'Produto cadastrado com sucesso!', tipo: 'success' });
      }

      setFormAberto(false);
      setProdutoEditando(null);
      recarregarProdutos();
    } catch (e) {
      const mensagem = e.response?.data?.message || 'Erro ao salvar produto.';
      setToast({ mensagem, tipo: 'error' });
    }
  };

  const recarregarProdutos = async () => {
    setCarregando(true);
    try {
      const params = {
        page: paginaAtual - 1,
        size: ITENS_POR_PAGINA,
      };
      if (busca.trim()) params.busca = busca.trim();
      if (categoriaAtiva !== 'todos') params.categoria = categoriaAtiva;

      const data = await listarProdutosAdmin(params);
      setProdutos(data.content);
      setTotalProdutos(data.totalElements);
      setTotalPaginas(data.totalPages);
    } catch (e) {
      if (e.response?.status === 401) {
        onLogout();
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleApagar = useCallback((id) => {
    setConfirmacao({
      id,
      titulo: 'Excluir produto',
      mensagem: 'Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.',
    });
  }, []);

  const confirmarApagar = async () => {
    if (!confirmacao) return;
    try {
      await deletarProduto(confirmacao.id);
      setConfirmacao(null);
      setToast({ mensagem: 'Produto excluído com sucesso!', tipo: 'success' });
      recarregarProdutos();
    } catch (e) {
      const mensagem = e.response?.data?.message || 'Erro ao excluir produto.';
      setToast({ mensagem, tipo: 'error' });
      setConfirmacao(null);
    }
  };

  const handleCategoriaChange = (slug) => {
    setCategoriaAtiva(slug);
    setPaginaAtual(1);
  };

  const handleBuscaChange = (value) => {
    setBusca(value);
    setPaginaAtual(1);
  };

  const handlePageChange = (page) => {
    setPaginaAtual(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <AdminHeader onLogout={onLogout} />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.topBar}>
            <div>
              <h1 className={styles.title}>Produtos</h1>
              <p className={styles.subtitle}>
                {totalProdutos} produto{totalProdutos !== 1 ? 's' : ''} cadastrado
                {totalProdutos !== 1 ? 's' : ''}
              </p>
            </div>
            <button className={styles.addBtn} onClick={handleAdicionar}>
              <Plus size={18} /> Adicionar produto
            </button>
          </div>

          {toast && (
            <Toast
              mensagem={toast.mensagem}
              tipo={toast.tipo}
              onClose={() => setToast(null)}
            />
          )}

          {confirmacao && (
            <ConfirmDialog
              titulo={confirmacao.titulo}
              mensagem={confirmacao.mensagem}
              onConfirm={confirmarApagar}
              onCancel={() => setConfirmacao(null)}
            />
          )}

          <div className={styles.filters}>
            <div className={styles.searchWrap}>
              <Search size={18} />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={busca}
                onChange={(e) => handleBuscaChange(e.target.value)}
                aria-label="Buscar produtos"
              />
            </div>

            <div className={styles.categoryWrap}>
              <button
                className={`${styles.chip} ${categoriaAtiva === 'todos' ? styles.active : ''}`}
                onClick={() => handleCategoriaChange('todos')}
              >
                Todos
              </button>
              {categoriasDisponiveis.map((cat) => (
                <button
                  key={cat.slug}
                  className={`${styles.chip} ${categoriaAtiva === cat.slug ? styles.active : ''}`}
                  onClick={() => handleCategoriaChange(cat.slug)}
                >
                  <span>{cat.icone}</span>
                  <span>{cat.nome}</span>
                </button>
              ))}
            </div>
          </div>

          {carregando ? (
            <p className="loadingMessage">Carregando produtos...</p>
          ) : (
            <>
              <AdminProductGrid
                produtos={produtos}
                onEdit={handleEditar}
                onDelete={handleApagar}
              />

              <Pagination
                currentPage={paginaAtual}
                totalPages={totalPaginas}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </main>

      <Footer />

      {formAberto && (
        <ProductForm
          produto={produtoEditando}
          categorias={categoriasDisponiveis}
          onSave={handleSalvar}
          onClose={handleFecharForm}
        />
      )}
    </>
  );
}
