import { useState, useEffect } from 'react';
import { Search, Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export default function Header({ onSearch }) {
  const [compact, setCompact] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => setCompact(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <img src="/logo.png" alt="Seleção de Achados" className={styles.logoIcon} />
          Seleção de Achados
        </a>

        <div className={`${styles.searchBar} ${searchOpen ? styles.open : ''}`}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={query}
            onChange={handleChange}
            aria-label="Buscar produtos"
          />
        </div>

        <nav className={styles.nav}>
          <a href="#sobre" className={styles.navLink}>Sobre</a>
          <a href="#privacidade" className={styles.navLink}>Política de Privacidade</a>
          <a href="#contato" className={styles.navLink}>Contato</a>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Buscar"
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X size={20} /> : <Search size={20} />}
          </button>

          <button
            className={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className={styles.drawer} onClick={() => setMenuOpen(false)}>
          <a href="#sobre" className={styles.drawerLink}>Sobre</a>
          <a href="#privacidade" className={styles.drawerLink}>Política de Privacidade</a>
          <a href="#contato" className={styles.drawerLink}>Contato</a>
        </nav>
      )}
    </header>
  );
}
