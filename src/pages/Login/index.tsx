import React, { useCallback, useState } from "react";
import './Login.css';
import sulogLogin from '../../assets/images/sulog_login.svg';
import sulogLogo from '../../assets/images/logoMobile.svg';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from "../../services/api";

import Loading from "../../core/common/Loading";
import api from "../../services/api";
import history from "../../services/history";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleSubmit = useCallback(async (email:string, password:string) =>{
    try {
      setLoading(true);

      const body = {
        email: email,
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
  },[])
  return (
    <div className="login-container">
      {loading && <Loading loading={loading}/>}
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
        <form className="login-form" onSubmit={(e)=>{e.preventDefault();handleSubmit(email,password)}}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-icon">
              <FaEnvelope className="icon" />
              <input type="email" id="email" name="email" onChange={(e)=>setEmail(e.target.value.toUpperCase())} required />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-icon">
              <FaLock className="icon" />
               <input type={showPassword ? "text" : "password"} id="password" name="password" onChange={(e) => setPassword(e.target.value)} required />
                            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
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
