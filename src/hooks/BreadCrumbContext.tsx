import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

// Defina o tipo para o contexto
interface BreadcrumbContextType {
  breadcrumb: string[];
  addBreadcrumb: (item: string) => void;
  removeBreadcrumb: () => void;
}

// Crie o contexto com o tipo definido
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

// Defina o tipo para os props do provider
interface BreadcrumbProviderProps {
  children: ReactNode;
}

export const BreadcrumbProvider: React.FC<BreadcrumbProviderProps> = ({ children }) => {
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  const addBreadcrumb = (item: string) => {
    setBreadcrumb((prev) => [...prev, item]);
  };

  const removeBreadcrumb = () => {
    let breadcrumbItem = breadcrumb.splice(breadcrumb.length - 1, 0);

    setBreadcrumb(breadcrumbItem);
  }

  const loadBreadCrumb = useCallback(() => {
    const paths = window.location.pathname
      .replace("/", "")
      .split("/")
      .slice(1, 3);


    const removePathsList = paths.filter((item: any) => item !== "listar"); 

    setBreadcrumb(removePathsList);
  }, []);

  useEffect(() => {
    loadBreadCrumb();
  }, [loadBreadCrumb]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumb, addBreadcrumb, removeBreadcrumb }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useBreadcrumb = (): BreadcrumbContextType => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
};