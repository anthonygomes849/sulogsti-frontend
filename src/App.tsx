import { useCallback, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { AuthenticateProvider } from "./hooks/AuthenticateContext";
import { StatusProvider } from "./hooks/StatusContext";
import router from "./routes";
import api from "./services/api";
import { useAxiosInterceptor } from "./services/interceptors";

function App() {
  useAxiosInterceptor();

  const fetchPermissions = useCallback(async () => {
    try {
      const response = await api.post("/listar/gruposPermissoes", {
        id_usuario: 1,
      }); // Ajuste conforme necessário
      const fetchedPermissions = response.data.map((item: any) => ({
        action: item.permissoes.acao,
        module: item.permissoes.modulo,
        submodule: item.permissoes.submodulo,
      }));

      sessionStorage.setItem("permissions", JSON.stringify(fetchedPermissions));
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }, []);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  return (
    <div className="flex w-full h-screen">
      <AuthenticateProvider>
        <StatusProvider>

        <RouterProvider router={router} />
        </StatusProvider>
      </AuthenticateProvider>
    </div>
  );
}

export default App;
