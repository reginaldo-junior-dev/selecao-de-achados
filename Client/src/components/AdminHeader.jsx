import { LogOut, LayoutDashboard } from 'lucide-react';
import styles from './AdminHeader.module.css';

export default function AdminHeader({ onLogout }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>✦</span>
          <span className={styles.title}>Seleção de Achados</span>
          <span className={styles.divider}>/</span>
          <span className={styles.badge}>
            <LayoutDashboard size={14} /> Admin
          </span>
        </div>

        <button className={styles.logout} onClick={onLogout}>
          <LogOut size={18} /> Sair
        </button>
      </div>
    </header>
  );
}
