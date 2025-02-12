import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

// const { onRefreshToken } = useBreadcrumb();

api.interceptors.response.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  console.log("Entrou");
  // Do something with request error
  window.parent.postMessage('Token Expirado', '*');

  return Promise.reject(error);
});


export default api;