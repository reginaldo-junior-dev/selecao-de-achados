import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import styles from './ProductCard.module.css';
import { registrarClique } from '../services/cliqueService';
import { getImageUrl } from '../utils/getImageUrl';

export default function ProductCard({ produto }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const badgeClass = produto.badge === 'Em oferta' ? styles.success : styles.amber;

  const handleClick = async () => {
    try {
      await registrarClique(produto.id);
    } catch {
      // Silencia erro de clique para não prejudicar a navegação
    }
  };

  return (
    <article className={styles.card}>
      <a
        href={produto.linkAfiliado || produto.link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkWrap}
        aria-label={`${produto.nome} — Ver oferta`}
        onClick={handleClick}
      >
        <div className={styles.imageWrapper}>
          <img
            src={getImageUrl(produto.imagem)}
            alt={produto.nome}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={`${styles.imagem} ${imgLoaded ? styles.loaded : ''}`}
          />
          {produto.origem && (
            <span
              className={`${styles.badge} ${produto.origem === 'shopee' ? styles.shopee : styles.ml}`}
            >
              {produto.origem === 'shopee' ? 'Shopee' : 'Mercado Livre'}
            </span>
          )}
          {produto.badge && (
            <span className={`${styles.badge} ${styles.destaque} ${badgeClass}`}>{produto.badge}</span>
          )}
        </div>

        <div className={styles.body}>
          <h3 className={styles.nome}>{produto.nome}</h3>
          <p className={styles.chamada}>{produto.chamada}</p>
          <span className={styles.cta}>
            Ver Oferta <ArrowRight size={16} />
          </span>
        </div>
      </a>
    </article>
  );
}
