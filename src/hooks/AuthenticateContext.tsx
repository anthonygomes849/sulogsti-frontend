import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import api from "../services/api";
import { useError } from "./ErrorContext";

// Defina o tipo para o contexto
interface AuthenticateContextType {
  onRefreshToken: () => void;
  // breadcrumb: string[];
  // addBreadcrumb: (item: string) => void;
  // removeBreadcrumb: () => void;
}

// Crie o contexto com o tipo definido
const AuthenticateContext = createContext<AuthenticateContextType | undefined>(
  undefined
);

// Defina o tipo para os props do provider
interface AuthenticateProviderProps {
  children: ReactNode;
}

export const AuthenticateProvider: React.FC<AuthenticateProviderProps> = ({
  children,
}) => {

  const { error } = useError();


  const onAuthenticate = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);

    const token = urlParams.get("token");

    api.defaults.headers.common = { Authorization: `Bearer ${token}` };
  }, []);

  const onRefreshToken = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);

      const token = urlParams.get("token");

      const body = {
        token: token,
      };

      const response = await api.post('/autenticar/refreshToken', body);


    } catch {}
  }, []);

  useEffect(() => {
    onAuthenticate();
  }, [onAuthenticate]);

  // useEffect(() => {
  //   if(error) {
  //     onRefreshToken();
  //   }
  // }, [error])

  return (
    <AuthenticateContext.Provider value={{ onRefreshToken }}>
      {children}
    </AuthenticateContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useBreadcrumb = (): AuthenticateContextType => {
  const context = useContext(AuthenticateContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
