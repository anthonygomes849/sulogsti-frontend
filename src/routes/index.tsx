import { createBrowserRouter } from "react-router-dom";
import CreateVeiculos from "../pages/Cadastro/Veiculos/View/Create/CreateVeiculo";
import InfoVeiculo from "../pages/Cadastro/Veiculos/View/Info";
import ListVeiculo from "../pages/Cadastro/Veiculos/View/List/ListVeiculo";
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