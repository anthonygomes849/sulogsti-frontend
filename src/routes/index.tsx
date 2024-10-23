import { createBrowserRouter } from "react-router-dom";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import CreateVeiculos from "../pages/Cadastro/Veiculos/Create";
import InfoVeiculo from "../pages/Cadastro/Veiculos/Info";
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
]);

export default router;