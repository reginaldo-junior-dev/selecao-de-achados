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

      <section id="sobre" className="sobreSection">
        <div className="container">
          <h2>Sobre</h2>
          <p>
            O <strong>Seleção de Achados</strong> reúne produtos cuidadosamente selecionados de grandes marketplaces, como Mercado Livre e Shopee, para facilitar sua busca pelas melhores opções em um só lugar.
          </p>
          <p>
            Nosso objetivo é economizar seu tempo, destacando produtos com bom custo-benefício, qualidade e praticidade para o dia a dia. Em vez de navegar por centenas de anúncios, você encontra sugestões organizadas por categorias e pode acessar diretamente a oferta do vendedor.
          </p>
          <p>
            Não realizamos vendas diretamente pelo site. Ao clicar em um produto, você será redirecionado para o marketplace parceiro, onde a compra é finalizada com toda a segurança da plataforma.
          </p>
          <p>
            O Seleção de Achados está sempre sendo atualizado com novos produtos para oferecer uma experiência simples, rápida e confiável na hora de encontrar boas oportunidades.
          </p>
        </div>
      </section>

      <section id="contato" className="contatoSection">
        <div className="container">
          <h2>Contato</h2>
          <p>
            Caso tenha dúvidas, sugestões ou queira relatar algum problema no funcionamento do <strong>Seleção de Achados</strong>, entre em contato:
          </p>
          <p>
            E-mail: <a href="mailto:selecaodeachados@outlook.com">selecaodeachados@outlook.com</a>
          </p>
          <h3>Importante</h3>
          <p>
            O Seleção de Achados atua apenas como um site de divulgação de produtos. Não realizamos vendas, processamos pagamentos ou enviamos mercadorias.
          </p>
          <p>
            Todas as compras são feitas diretamente nos marketplaces parceiros, como Mercado Livre e Shopee. Em caso de dúvidas sobre pedidos, entrega, troca, devolução, garantia ou reembolso, entre em contato com o atendimento da plataforma onde a compra foi realizada.
          </p>
        </div>
      </section>

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
