import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../services/api';

interface Permission {
  action: string;
}

// Crie um contexto para as permissões
const PermissionContext = createContext<Permission[] | undefined>(undefined);

// Hook para usar o contexto
export const usePermissions = () => {
  const permissions = useContext(PermissionContext);

  if (!permissions) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }

  const paths = window.location.pathname
  .replace("/", "")
  .split("/");


  // Função para verificar se a permissão existe
  const hasPermission = useCallback(
    (action: string): boolean => {
      console.log(permissions.some((perm: any) => perm.action === action.toUpperCase() && perm.module === paths[0].toUpperCase()));
      return permissions.some(
        (perm: any) =>
          perm.action === action.toUpperCase() &&
          perm.module === paths[0].toUpperCase() &&
          perm.submodule === paths[1].toUpperCase()
      );
    },
    [permissions]
  );




  return {hasPermission};
};

// Provider para fornecer as permissões
export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await api.post('/listar/gruposPermissoes', { id_usuario: 1 }); // Ajuste conforme necessário
        const fetchedPermissions = response.data.map((item: any) => ({
          action: item.permissoes.acao,
          module: item.permissoes.modulo,
          submodule: item.permissoes.submodulo,
        }));
        setPermissions(fetchedPermissions);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};