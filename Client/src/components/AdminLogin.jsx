import { useState } from 'react';
import { Lock, User, ArrowRight } from 'lucide-react';
import { login } from '../services/authService';
import styles from './AdminLogin.module.css';

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const data = await login(email.trim(), senha);
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify({ nome: data.nome, email: data.email }));
      onLogin();
    } catch (err) {
      const mensagem = err.response?.data?.erro || 'Erro ao fazer login. Tente novamente.';
      setErro(mensagem);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logoIcon}>✦</span>
          <h1>Admin</h1>
        </div>
        <p className={styles.subtitle}>Painel de gerenciamento de produtos</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">E-mail</label>
            <div className={styles.inputWrap}>
              <User size={18} />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite o e-mail"
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor="senha">Senha</label>
            <div className={styles.inputWrap}>
              <Lock size={18} />
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Digite a senha"
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {erro && <p className={styles.erro}>{erro}</p>}

          <button type="submit" className={styles.submit} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'} <ArrowRight size={18} />
          </button>
        </form>

      </div>
    </div>
  );
}
