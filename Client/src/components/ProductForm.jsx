import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Trash2, ImageIcon, Loader2 } from 'lucide-react';
import { uploadImagem } from '../services/uploadService';
import { getImageUrl } from '../utils/getImageUrl';
import styles from './ProductForm.module.css';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANHO_MAXIMO_MB = 2;

export default function ProductForm({ produto, categorias, onSave, onClose }) {
  const valoresIniciais = useMemo(
    () => ({
      nome: '',
      categorias: [],
      chamada: '',
      badge: '',
      imagem: '',
      link: '',
      origem: 'mercadolivre',
      ativo: true,
      ordem: 0,
    }),
    []
  );

  const [form, setForm] = useState(valoresIniciais);
  const [erroImagem, setErroImagem] = useState('');
  const [uploadando, setUploadando] = useState(false);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);
  const inputFileRef = useRef(null);
  const blobUrlRef = useRef(null);

  useEffect(() => {
    if (produto) {
      const slugs = produto.categorias?.map((c) => c.slug) || [];
      setForm({
        nome: produto.nome || '',
        categorias: slugs,
        chamada: produto.chamada || '',
        badge: produto.badge || '',
        imagem: produto.imagem || '',
        link: produto.linkAfiliado || produto.link || '',
        origem: produto.origem || 'mercadolivre',
        ativo: produto.ativo ?? true,
        ordem: produto.ordem ?? 0,
      });
    } else {
      setForm({ ...valoresIniciais });
    }
    setErroImagem('');
    setArquivoSelecionado(null);
  }, [produto, categorias, valoresIniciais]);

  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
      }
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (name === 'imagem') {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setArquivoSelecionado(null);
    }
  };

  const handleCategoriaToggle = (slug) => {
    setForm((prev) => ({
      ...prev,
      categorias: prev.categorias.includes(slug)
        ? prev.categorias.filter((s) => s !== slug)
        : [...prev.categorias, slug],
    }));
  };

  const handleImagemUpload = (e) => {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;

    setErroImagem('');

    if (!TIPOS_PERMITIDOS.includes(arquivo.type)) {
      setErroImagem('Formato inválido. Use JPG, PNG, WEBP ou GIF.');
      return;
    }

    if (arquivo.size > TAMANHO_MAXIMO_MB * 1024 * 1024) {
      setErroImagem(`A imagem deve ter no máximo ${TAMANHO_MAXIMO_MB}MB.`);
      return;
    }

    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
    }

    const urlPreview = URL.createObjectURL(arquivo);
    blobUrlRef.current = urlPreview;
    setArquivoSelecionado(arquivo);
    setForm((prev) => ({ ...prev, imagem: urlPreview }));
  };

  const handleRemoverImagem = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setArquivoSelecionado(null);
    setForm((prev) => ({ ...prev, imagem: '' }));
    setErroImagem('');
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let urlImagem = form.imagem;

    if (arquivoSelecionado) {
      setUploadando(true);
      try {
        urlImagem = await uploadImagem(arquivoSelecionado);
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
        setArquivoSelecionado(null);
      } catch {
        setErroImagem('Erro ao enviar imagem. Tente novamente.');
        setUploadando(false);
        return;
      }
      setUploadando(false);
    }

    const produtoFinal = {
      ...produto,
      ...form,
      imagem: urlImagem,
      badge: form.badge.trim() || null,
    };

    onSave(produtoFinal);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{produto ? 'Editar Produto' : 'Adicionar Produto'}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="nome">Nome do produto *</label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={form.nome}
              onChange={handleChange}
              placeholder="Ex: Fritadeira Air Fryer"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Categorias *</label>
            <div className={styles.checkboxGroup}>
              {categorias.map((cat) => (
                <label key={cat.slug} className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={form.categorias.includes(cat.slug)}
                    onChange={() => handleCategoriaToggle(cat.slug)}
                  />
                  <span>{cat.icone}</span>
                  <span>{cat.nome}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="chamada">Chamada / Descrição curta *</label>
            <input
              id="chamada"
              name="chamada"
              type="text"
              value={form.chamada}
              onChange={handleChange}
              placeholder="Ex: Praticidade no dia a dia."
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="badge">Badge (opcional)</label>
            <input
              id="badge"
              name="badge"
              type="text"
              value={form.badge}
              onChange={handleChange}
              placeholder="Ex: Em oferta, Mais vendido"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="origem">Origem *</label>
            <select
              id="origem"
              name="origem"
              value={form.origem}
              onChange={handleChange}
              required
            >
              <option value="mercadolivre">Mercado Livre</option>
              <option value="shopee">Shopee</option>
            </select>
          </div>

          <div className={styles.field}>
            <label>Imagem do produto *</label>

            <input
              ref={inputFileRef}
              id="imagem-file"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImagemUpload}
              className={styles.fileInput}
            />

            {form.imagem ? (
              <div className={styles.previewWrap}>
                <img
                  src={getImageUrl(form.imagem)}
                  alt="Pré-visualização do produto"
                  className={styles.previewImage}
                />
                <button
                  type="button"
                  className={styles.removeImage}
                  onClick={handleRemoverImagem}
                  aria-label="Remover imagem"
                >
                  <Trash2 size={16} />
                  <span>Remover imagem</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                className={styles.uploadArea}
                onClick={() => inputFileRef.current?.click()}
                disabled={uploadando}
              >
                <ImageIcon size={32} />
                <span>{uploadando ? 'Enviando...' : 'Clique para enviar uma imagem'}</span>
                <small>JPG, PNG, WEBP ou GIF · até {TAMANHO_MAXIMO_MB}MB</small>
              </button>
            )}

            {erroImagem && <span className={styles.erro}>{erroImagem}</span>}

            <div className={styles.urlFallback}>
              <label htmlFor="imagem">Ou cole a URL da imagem</label>
              <input
                id="imagem"
                name="imagem"
                type="text"
                value={form.imagem}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="link">Link de afiliado *</label>
            <input
              id="link"
              name="link"
              type="text"
              value={form.link}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.save} disabled={uploadando}>
              {uploadando ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Enviando...
                </>
              ) : (
                produto ? 'Salvar alterações' : 'Cadastrar produto'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
