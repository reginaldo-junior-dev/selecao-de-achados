import styles from './Hero.module.css';

export default function Hero({ total }) {
  return (
    <section className={styles.hero}>
      <div className={styles.gridBg} aria-hidden="true" />
      <div className={styles.content}>
        <span className={styles.tag}>✦ Seleção de Achados</span>
        <h1 className={styles.headline}>Os melhores achados, reunidos aqui.</h1>
        <p className={styles.sub}>
          Produtos selecionados com cuidado. Direto no Mercado Livre e Shoppe.
        </p>
        <div className={styles.counter}>
          <strong>{total}</strong> produtos selecionados
        </div>
        <a href="#produtos" className={styles.cta}>
          Explorar produtos
        </a>
      </div>
    </section>
  );
}
