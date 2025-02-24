import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

// const { onRefreshToken } = useBreadcrumb();

api.interceptors.response.use(function (config) {
  return config;
}, function (error) {
  // Envia mensagem caso retorne 401
  window.parent.postMessage('Token Expirado', '*');

  // history.push('/');
  // window.location.reload();

  return Promise.reject(error);
});


export default api;