import { createBrowserRouter } from "react-router-dom";
import ListMensalista from "../pages/Cadastro/Mensalista";
import ListMotorista from "../pages/Cadastro/Motoristas";
import Terminal from "../pages/Cadastro/Terminal";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import ListTipoServico from "../pages/Configuracoes/TipoServico";
import ListOperacoesPatioServicos from "../pages/OperacoesPatio/OperacoesPatioServicos";
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
  },
  {
    path: '/operacaoPatio/servicos',
    element: (
      <Route>
        <ListOperacoesPatioServicos />
      </Route>
    )
  },
  {
    path: '/configuracoes/tipoServicos',
    element: (
      <Route>
        <ListTipoServico />
      </Route>
    )
  },
  {
    path: '/cadastros/terminais',
    element: (
      <Route>
        <Terminal />
      </Route>
    )
  }
]);

export default router;