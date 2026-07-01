import { useState, useMemo, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryFilter from './components/CategoryFilter';
import ProductGrid from './components/ProductGrid';
import Pagination from './components/Pagination';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import { listarProdutos } from './services/produtoService';
import { listarCategorias } from './services/categoriaService';

const ITENS_POR_PAGINA = 16;

function PaginaInicial() {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [busca, setBusca] = useState('');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [produtos, setProdutos] = useState([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [categorias, setCategorias] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const categoriaTodos = useMemo(
    () => ({ slug: 'todos', nome: 'Todos os Achados', icone: '⭐' }),
    []
  );

  useEffect(() => {
    async function carregarCategorias() {
      try {
        const data = await listarCategorias();
        const ativas = data.filter((c) => c.ativo && c.slug !== 'todos');
        setCategorias([categoriaTodos, ...ativas]);
      } catch {
        setErro('Erro ao carregar categorias.');
      }
    }
    carregarCategorias();
  }, [categoriaTodos]);

  useEffect(() => {
    async function carregarTotal() {
      try {
        const data = await listarProdutos({ size: 1 });
        setTotalProdutos(data.totalElements);
      } catch {
        setErro('Erro ao carregar total de produtos.');
      }
    }
    carregarTotal();
  }, []);

  useEffect(() => {
    async function carregarProdutos() {
      setCarregando(true);
      setErro('');
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

        const data = await listarProdutos(params);
        setProdutos(data.content);
        setTotalPaginas(data.totalPages);
      } catch {
        setErro('Erro ao carregar produtos. Tente novamente.');
      } finally {
        setCarregando(false);
      }
    }
    carregarProdutos();
  }, [categoriaAtiva, busca, paginaAtual]);

  const handleCategoriaChange = (slug) => {
    setCategoriaAtiva(slug);
    setPaginaAtual(1);
  };

  const handleBuscaChange = useCallback((value) => {
    setBusca(value);
    setPaginaAtual(1);
  }, []);

  const handlePageChange = (page) => {
    setPaginaAtual(page);
    document.getElementById('produtos')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Header onSearch={handleBuscaChange} />
      <main>
        <Hero total={totalProdutos} />
        <section id="produtos" className="productsSection">
          <div className="container">
            <CategoryFilter
              categorias={categorias}
              ativa={categoriaAtiva}
              onChange={handleCategoriaChange}
            />
            {erro && <p className="errorMessage">{erro}</p>}
            {carregando ? (
              <p className="loadingMessage">Carregando produtos...</p>
            ) : (
              <>
                <ProductGrid produtos={produtos} />
                <Pagination
                  currentPage={paginaAtual}
                  totalPages={totalPaginas}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [autenticado, setAutenticado] = useState(
    () => !!localStorage.getItem('admin_token')
  );

  const login = useCallback(() => setAutenticado(true), []);
  const logout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAutenticado(false);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<PaginaInicial />} />
      <Route
        path="/login"
        element={
          autenticado ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={login} />
        }
      />
      <Route
        path="/admin"
        element={
          autenticado ? <AdminPanel onLogout={logout} /> : <Navigate to="/login" replace />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
