import { useState, useEffect, useCallback } from 'react';
import { X, Loader2, Trash2 } from 'lucide-react';
import {
  listarTextosMarketing,
  criarTextoMarketing,
  atualizarTextoMarketing,
  deletarTextoMarketing,
} from '../services/marketingService';
import styles from './MarketingForm.module.css';

export default function MarketingForm({ produtoId, produtoNome, onClose, onToast }) {
  const [legenda, setLegenda] = useState('');
  const [descricao, setDescricao] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [textosExistentes, setTextosExistentes] = useState({});

  const carregarTextos = useCallback(async () => {
    setCarregando(true);
    try {
      const textos = await listarTextosMarketing(produtoId);
      const mapa = {};
      textos.forEach((t) => {
        mapa[t.redeSocial] = t;
      });
      setTextosExistentes(mapa);
      setLegenda(mapa.INSTAGRAM?.conteudo || '');
      setDescricao(mapa.YOUTUBE?.conteudo || '');
    } catch {
      onToast({ mensagem: 'Erro ao carregar textos de marketing.', tipo: 'error' });
    } finally {
      setCarregando(false);
    }
  }, [produtoId, onToast]);

  useEffect(() => {
    carregarTextos();
  }, [carregarTextos]);

  const handleLimpar = async (redeSocial) => {
    const existente = textosExistentes[redeSocial];
    if (!existente) return;

    try {
      await deletarTextoMarketing(existente.id);
      delete textosExistentes[redeSocial];
      setTextosExistentes({ ...textosExistentes });

      if (redeSocial === 'INSTAGRAM') {
        setLegenda('');
      } else {
        setDescricao('');
      }

      onToast({ mensagem: 'Texto removido com sucesso.', tipo: 'success' });
    } catch {
      onToast({ mensagem: 'Erro ao remover texto.', tipo: 'error' });
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      const promises = [];

      const dadosInstagram = {
        produtoId,
        redeSocial: 'INSTAGRAM',
        conteudo: legenda,
      };

      const dadosYouTube = {
        produtoId,
        redeSocial: 'YOUTUBE',
        conteudo: descricao,
      };

      const existenteInstagram = textosExistentes.INSTAGRAM;
      if (existenteInstagram) {
        if (legenda.trim()) {
          promises.push(atualizarTextoMarketing(existenteInstagram.id, dadosInstagram));
        } else {
          promises.push(deletarTextoMarketing(existenteInstagram.id));
        }
      } else if (legenda.trim()) {
        promises.push(criarTextoMarketing(dadosInstagram));
      }

      const existenteYouTube = textosExistentes.YOUTUBE;
      if (existenteYouTube) {
        if (descricao.trim()) {
          promises.push(atualizarTextoMarketing(existenteYouTube.id, dadosYouTube));
        } else {
          promises.push(deletarTextoMarketing(existenteYouTube.id));
        }
      } else if (descricao.trim()) {
        promises.push(criarTextoMarketing(dadosYouTube));
      }

      await Promise.all(promises);

      onToast({ mensagem: 'Textos de marketing salvos com sucesso!', tipo: 'success' });
      onClose();
    } catch (e) {
      const mensagem = e.response?.data?.message || 'Erro ao salvar textos de marketing.';
      onToast({ mensagem, tipo: 'error' });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Marketing — {produtoNome}</h2>
          <button className={styles.close} onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        {carregando ? (
          <div className={styles.loading}>
            <Loader2 size={24} className={styles.spinner} />
            <span>Carregando...</span>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSalvar}>
            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor="legenda">
                  <span className={styles.platform}>Instagram</span> Legenda
                </label>
                {textosExistentes.INSTAGRAM && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => handleLimpar('INSTAGRAM')}
                    title="Remover texto do Instagram"
                  >
                    <Trash2 size={14} />
                    Limpar
                  </button>
                )}
              </div>
              <textarea
                id="legenda"
                value={legenda}
                onChange={(e) => setLegenda(e.target.value)}
                placeholder="Digite o texto de divulgação para o Instagram..."
                rows={5}
              />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldHeader}>
                <label htmlFor="descricao">
                  <span className={styles.platform}>YouTube</span> Descrição
                </label>
                {textosExistentes.YOUTUBE && (
                  <button
                    type="button"
                    className={styles.clearBtn}
                    onClick={() => handleLimpar('YOUTUBE')}
                    title="Remover texto do YouTube"
                  >
                    <Trash2 size={14} />
                    Limpar
                  </button>
                )}
              </div>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Digite o texto de divulgação para o YouTube..."
                rows={5}
              />
            </div>

            <div className={styles.actions}>
              <button type="button" className={styles.cancel} onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className={styles.save} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    Salvando...
                  </>
                ) : (
                  'Salvar textos'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
