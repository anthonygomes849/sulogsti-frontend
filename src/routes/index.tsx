import { createBrowserRouter } from "react-router-dom";
import ListMensalista from "../pages/Cadastro/Mensalista";
import ListMotorista from "../pages/Cadastro/Motoristas";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import Route from "./route";

const router = createBrowserRouter([
  {
    path: '/cadastros/veiculos',
    element: (
      <Route>
        <ListVeiculo />
      </Route>
    )
  },
  {
    path: '/cadastros/motoristas',
    element: (
      <Route>
        <ListMotorista />
      </Route>
    )
  },
  {
    path: '/cadastros/motoristas/adicionar',
    element: (
      <Route>
        <ListMotorista />
      </Route>
    )
  },
  {
    path: '/cadastros/mensalistas',
    element: (
      <Route>
        <ListMensalista />
      </Route>
    )
  }
]);

export default router;