import styles from './CategoryFilter.module.css';

export default function CategoryFilter({ categorias, ativa, onChange }) {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Categorias">
      {categorias.map((cat) => (
        <button
          key={cat.slug}
          role="tab"
          aria-selected={ativa === cat.slug}
          className={`${styles.chip} ${ativa === cat.slug ? styles.ativo : ''}`}
          onClick={() => onChange(cat.slug)}
        >
          {cat.icone && <span className={styles.icon}>{cat.icone}</span>}
          <span className={styles.label}>{cat.nome}</span>
        </button>
      ))}
    </div>
  );
}
