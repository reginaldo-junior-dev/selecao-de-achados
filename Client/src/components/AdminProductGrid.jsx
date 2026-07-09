import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import styles from './AdminProductGrid.module.css';
import { getImageUrl } from '../utils/getImageUrl';

export default function AdminProductGrid({ produtos, onEdit, onDelete }) {
  if (!produtos.length) {
    return <p className={styles.vazio}>Nenhum produto encontrado.</p>;
  }

  return (
    <div className={styles.grid}>
      {produtos.map((produto) => (
        <article key={produto.id} className={styles.card}>
          <div className={styles.imageWrapper}>
            <img
              src={getImageUrl(produto.imagem)}
              alt={produto.nome}
              loading="lazy"
              className={styles.imagem}
            />
            {produto.origem && (
              <span
                className={`${styles.badge} ${produto.origem === 'shopee' ? styles.shopee : styles.ml}`}
              >
                {produto.origem === 'shopee' ? 'Shopee' : 'Mercado Livre'}
              </span>
            )}
            {produto.badge && (
              <span className={`${styles.badge} ${styles.destaque}`}>{produto.badge}</span>
            )}
          </div>

          <div className={styles.body}>
            <h3 className={styles.nome}>{produto.nome}</h3>
            <p className={styles.chamada}>{produto.chamada}</p>
            <span className={styles.categoria}>
              {produto.categorias?.map((c) => c.nome).join(', ')}
            </span>
          </div>

          <div className={styles.actions}>
            <a
              href={produto.linkAfiliado || produto.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.actionBtn}
              aria-label="Abrir link"
            >
              <ExternalLink size={16} />
            </a>
            <button
              className={styles.actionBtn}
              onClick={() => onEdit(produto)}
              aria-label="Editar produto"
            >
              <Pencil size={16} />
            </button>
            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={() => onDelete(produto.id)}
              aria-label="Apagar produto"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
