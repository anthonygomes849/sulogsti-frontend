import React from 'react';
import './Login.css';
import sulogLogin from '../../assets/images/sulog_login.svg';
import sulogLogo from '../../assets/images/logoMobile.svg';
import { FaEnvelope, FaLock } from 'react-icons/fa';

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-left">
        <div className="logo-container">
          <img src={sulogLogin} alt="SULOG Logo" className="logo" />
          <h1>SULOG</h1>
          <p>Pátio de Triagem</p>
        </div>
      </div>
      <div className="login-right">
      <img src={sulogLogo} alt="SULOG Logo" className="logoMobile" />
        <div className="welcome-text">
          <h2 className="ola">Olá!</h2>
          <p className="bem-vindo">Bem-vindo de volta</p>
        </div>
        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-icon">
              <FaEnvelope className="icon" />
              <input type="email" id="email" name="email" required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-icon">
              <FaLock className="icon" />
              <input type="password" id="password" name="password" required />
            </div>
          </div>
          <div className="form-group form-inline">
            <div className="checkbox">
              <input type="checkbox" id="keep-logged-in" name="keep-logged-in" />
              <label htmlFor="keep-logged-in">Mantenha-me conectado</label>
            </div>
            <button type="submit" className="login-button">Entrar</button> 
          </div>
          <a href="/forgot-password" className="forgot-password-link">Esqueci a senha</a>
        </form>
        <footer>
          <a href="/terms" className="terms-link">Termos de uso e política de privacidade</a>
          <p>Versão 2.0</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;
