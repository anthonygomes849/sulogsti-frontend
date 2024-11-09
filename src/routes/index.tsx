import { createBrowserRouter } from "react-router-dom";
import ListMotorista from "../pages/Cadastro/Motoristas";
import CreateMotoristas from "../pages/Cadastro/Motoristas/Create";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import CreateVeiculos from "../pages/Cadastro/Veiculos/Create";
import InfoVeiculo from "../pages/Cadastro/Veiculos/Info";
import UpdateVeiculos from "../pages/Cadastro/Veiculos/Update";
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
    path: '/cadastro/veiculos/adicionar',
    element: (
      <Route>
        <CreateVeiculos />
      </Route>
    )
  },
  {
    path: '/cadastro/veiculos/conhecer',
    element: (
      <Route>
        <InfoVeiculo />
      </Route>
    )
  },
  {
    path: '/cadastro/veiculos/editar',
    element: (
      <Route>
        <UpdateVeiculos />
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
        <CreateMotoristas />
      </Route>
    )
  }
]);

export default router;