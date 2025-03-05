import { useCallback, useState } from "react";
import { FaEye, FaEyeSlash, FaKey, FaLock } from 'react-icons/fa';
import sulogLogo from '../../assets/images/logoMobile.svg';
import sulogLogin from '../../assets/images/sulog_login.svg';
import Loading from "../../core/common/Loading";
import api from "../../services/api";
import history from "../../services/history";
import './Login.css';

const RedefinicaoSenha = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async (token: string, password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    try {
      setLoading(true);

      const body = {
        token: token,
        senha: password,
      };
      const response = await api.post("/autenticar/login", body);
      api.defaults.headers.Authorization = `Bearer ${response.data.token}`;
      sessionStorage.setItem("token", response.data.token);
      history.push('/cadastros/veiculos');
      window.location.reload();

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <div className="login-container">
      {loading && <Loading loading={loading} />}
      <div className="login-left">
        <div className="logo-container">
          <img src={sulogLogin} alt="SULOG Logo" className="logo" />
          <h1>SULOG</h1>
          <p>Pátio de Triagem</p>
        </div>
      </div>
      <div className="login-right">
        <img src={sulogLogo} alt="SULOG Logo" className="logoMobile" />
        <form className="login-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(token, password, confirmPassword) }}>
          <div className="form-group">
            <label htmlFor="token">Codigo de verificação</label>
            <div className="input-icon">
              <FaKey className="icon" />
              <input type="token" id="token" name="token" onChange={(e) => setToken(e.target.value)} required />
            </div>
          </div>
          <div className={`form-group ${error ? 'error' : ''}`}>
            <label htmlFor="password">Nova senha</label>
            <div className="input-icon">
              <FaLock className="icon" />
              <input type={showPassword ? "text" : "password"} id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
              <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className={`form-group ${error ? 'error' : ''}`}>
            <label htmlFor="confirmPassword">Confirmar nova senha</label>
            <div className="input-icon">
              <FaLock className="icon" />
              <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} required />
              <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="form-group form-inline">
            <button type="submit" className="login-button">Salvar</button>
          </div>
        </form>
        <footer>
          <a href="/terms" className="terms-link">Termos de uso e política de privacidade</a>
          <p>Versão 2.0</p>
        </footer>
      </div>
    </div>
  );
};

export default RedefinicaoSenha;
