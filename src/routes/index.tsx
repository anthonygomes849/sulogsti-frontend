import { createBrowserRouter } from "react-router-dom";
import ListMensalista from "../pages/Cadastro/Mensalista";
import ListMotorista from "../pages/Cadastro/Motoristas";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import Route from "./route";

const router = createBrowserRouter([
  {
    path: '/cadastro/veiculos',
    element: (
      <Route>
        <ListVeiculo />
      </Route>
    )
  },
  {
    path: '/cadastro/motoristas',
    element: (
      <Route>
        <ListMotorista />
      </Route>
    )
  },
  {
    path: '/cadastro/motoristas/adicionar',
    element: (
      <Route>
        <ListMotorista />
      </Route>
    )
  },
  {
    path: '/cadastro/mensalista',
    element: (
      <Route>
        <ListMensalista />
      </Route>
    )
  }
]);

export default router;