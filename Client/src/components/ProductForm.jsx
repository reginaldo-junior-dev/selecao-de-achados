import { useState, useEffect, useRef, useMemo } from 'react';
import { X, Trash2, ImageIcon } from 'lucide-react';
import { uploadImagem } from '../services/uploadService';
import styles from './ProductForm.module.css';

const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const TAMANHO_MAXIMO_MB = 2;

export default function ProductForm({ produto, categorias, onSave, onClose }) {
  const valoresIniciais = useMemo(
    () => ({
      nome: '',
      categoria: categorias[0]?.slug || '',
      chamada: '',
      badge: '',
      imagem: '',
      link: '',
      origem: 'mercadolivre',
      ativo: true,
      ordem: 0,
    }),
    [categorias]
  );

  const [form, setForm] = useState(valoresIniciais);
  const [erroImagem, setErroImagem] = useState('');
  const [uploadando, setUploadando] = useState(false);
  const inputFileRef = useRef(null);

  useEffect(() => {
    if (produto) {
      setForm({
        nome: produto.nome || '',
        categoria: produto.categoriaSlug || produto.categoria || '',
        chamada: produto.chamada || '',
        badge: produto.badge || '',
        imagem: produto.imagem || '',
        link: produto.linkAfiliado || produto.link || '',
        origem: produto.origem || 'mercadolivre',
        ativo: produto.ativo ?? true,
        ordem: produto.ordem ?? 0,
      });
    } else {
      setForm({
        ...valoresIniciais,
        categoria: categorias[0]?.slug || '',
      });
    }
    setErroImagem('');
  }, [produto, categorias, valoresIniciais]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImagemUpload = async (e) => {
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

    setUploadando(true);
    try {
      const url = await uploadImagem(arquivo);
      setForm((prev) => ({ ...prev, imagem: url }));
    } catch {
      setErroImagem('Erro ao enviar imagem. Tente novamente.');
    } finally {
      setUploadando(false);
    }
  };

  const handleRemoverImagem = () => {
    setForm((prev) => ({ ...prev, imagem: '' }));
    setErroImagem('');
    if (inputFileRef.current) {
      inputFileRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const produtoFinal = {
      ...produto,
      ...form,
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
            <label htmlFor="categoria">Categoria *</label>
            <select
              id="categoria"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            >
              {categorias.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.nome}
                </option>
              ))}
            </select>
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
                  src={form.imagem}
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
            <button type="submit" className={styles.save}>
              {produto ? 'Salvar alterações' : 'Cadastrar produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
