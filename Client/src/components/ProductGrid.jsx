import ProductCard from './ProductCard';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ produtos }) {
  if (!produtos.length) {
    return <p className={styles.vazio}>Nenhum produto encontrado.</p>;
  }

  return (
    <div className={styles.grid}>
      {produtos.map((produto, idx) => (
        <div
          key={produto.id}
          className={styles.cardEnter}
          style={{ animationDelay: `${(idx % 8) * 0.05}s` }}
        >
          <ProductCard produto={produto} />
        </div>
      ))}
    </div>
  );
}
