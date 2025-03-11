import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
} from "react";
import api from "../services/api";

// Defina o tipo para o contexto
interface AuthenticateContextType {}

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
  const onAuthenticate = useCallback(() => {
    // const token = sessionStorage.getItem('token');

    const urlParams = new URLSearchParams(window.location.search);

    const token = urlParams.get("token");

    api.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    
    };
    // api.defaults.headers.common = { Accept: `application/json` };
  }, []);

  useEffect(() => {
    onAuthenticate();
  }, [onAuthenticate]);

  return (
    <AuthenticateContext.Provider value={{}}>
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
