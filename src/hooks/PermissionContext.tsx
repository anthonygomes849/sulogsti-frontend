import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

interface Permission {
  action: string;
}

// Crie um contexto para as permissões
const PermissionContext = createContext<Permission[] | undefined>(undefined);

// Hook para usar o contexto
export const usePermissions = (action: string) => {
  const permissions = useContext(PermissionContext);

  if (!permissions) {
    throw new Error("usePermissions must be used within a PermissionProvider");
  }

  const paths = window.location.pathname.replace("/", "").split("/");

  let permissionsData: any[] = [];

  const getPermissions = sessionStorage.getItem("permissions");

  if (getPermissions) {
    permissionsData = JSON.parse(getPermissions);
  }

  // console.log(permissionsData.some((perm: any) => perm.action === "CONHECER" && perm.module === paths[0].toUpperCase()));
  
  const hasPermission = permissionsData.some(
    (perm: any) =>
      perm.action === action.toUpperCase() &&
    perm.module === paths[0].toUpperCase() &&
    perm.submodule === paths[1].toUpperCase()
  );
  
  console.log(hasPermission);
  // Função para verificar se a permissão existe
  // const hasPermission = useCallback((action: string): boolean => {
  //   console.log(
  //     permissions.some(
  //       (perm: any) =>
  //         perm.action === action.toUpperCase() &&
  //         perm.module === paths[0].toUpperCase()
  //     )
  //   );
  //   return permissionsData.some(
  //     (perm: any) =>
  //       perm.action === action.toUpperCase() &&
  //       perm.module === paths[0].toUpperCase() &&
  //       perm.submodule === paths[1].toUpperCase()
  //   );
  // }, []);

  return hasPermission;
};

// Provider para fornecer as permissões
export const PermissionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    const getPermissions = sessionStorage.getItem("permissions");

    if (getPermissions) {
      setPermissions(JSON.parse(getPermissions));
    }
  }, []);

  return (
    <PermissionContext.Provider value={permissions}>
      {children}
    </PermissionContext.Provider>
  );
};
