import { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import styles from './Toast.module.css';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
};

export default function Toast({ mensagem, tipo = 'success', duracao = 3500, onClose }) {
  const [saindo, setSaindo] = useState(false);

  const fechar = useCallback(() => {
    setSaindo(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(fechar, duracao);
    return () => clearTimeout(timer);
  }, [duracao, fechar]);

  const Icone = ICONS[tipo];

  return (
    <div className={`${styles.toast} ${saindo ? styles.saindo : ''}`}>
      <Icone size={20} className={styles[tipo]} />
      <span className={styles.mensagem}>{mensagem}</span>
      <button className={styles.fechar} onClick={fechar} aria-label="Fechar">
        <X size={16} />
      </button>
    </div>
  );
}
