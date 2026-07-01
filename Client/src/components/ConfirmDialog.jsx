import { AlertTriangle, X } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

export default function ConfirmDialog({ titulo, mensagem, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onCancel} aria-label="Fechar">
          <X size={20} />
        </button>

        <div className={styles.iconWrap}>
          <AlertTriangle size={32} />
        </div>

        <h2 className={styles.titulo}>{titulo}</h2>
        <p className={styles.mensagem}>{mensagem}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Cancelar
          </button>
          <button className={styles.confirm} onClick={onConfirm}>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
