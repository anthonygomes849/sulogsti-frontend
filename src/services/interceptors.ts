import { useError } from "../hooks/ErrorContext";
import api from "./api";

export const useAxiosInterceptor = () => {
  const { setError } = useError();

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      setError(error.response?.data?.error || "Ocorreu um erro!");
      return Promise.reject(error);
    }
  );
};