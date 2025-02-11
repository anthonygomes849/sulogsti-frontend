import { createBrowserRouter } from "react-router-dom";
import ListMensalista from "../pages/Cadastro/Mensalista";
import ListMotorista from "../pages/Cadastro/Motoristas";
import Terminal from "../pages/Cadastro/Terminal";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import ListTipoServico from "../pages/Configuracoes/TipoServico";
import Login from "../pages/Login";
import OperacoesPatioEntradaVeiculos from "../pages/OperacoesPatio/OperacoesPatioEntradaVeiculos";
import ListOperacoesPatioServicos from "../pages/OperacoesPatio/OperacoesPatioServicos";
import OperacoesPortoAgendada from "../pages/OperacoesPorto/OperacoesPortoAgendada";
import PrivateRoute from "./privateRoute";
import Route from "./route";

const router = createBrowserRouter([
  {
    path: '',
    element: (
      <Route>
        <Login />
      </Route>
    )
  },
  {
    path: '/cadastros/veiculos',
    element: (
      <PrivateRoute>
        <ListVeiculo />
      </PrivateRoute>
    )
  },
  {
    path: '/cadastros/motoristas',
    element: (
      <PrivateRoute>
        <ListMotorista />
      </PrivateRoute>
    )
  },
  {
    path: '/cadastros/motoristas/adicionar',
    element: (
      <PrivateRoute>
        <ListMotorista />
      </PrivateRoute>
    )
  },
  {
    path: '/cadastros/mensalistas',
    element: (
      <PrivateRoute>
        <ListMensalista />
      </PrivateRoute>
    )
  },
  {
    path: '/operacoes_patio/servicos',
    element: (
      <PrivateRoute>
        <ListOperacoesPatioServicos />
      </PrivateRoute>
    )
  },
  {
    path: '/configuracoes/tipos_servicos',
    element: (
      <PrivateRoute>
        <ListTipoServico />
      </PrivateRoute>
    )
  },
  {
    path: '/cadastros/terminais',
    element: (
      <PrivateRoute>
        <Terminal />
      </PrivateRoute>
    )
  },
  {
    path: '/operacoes_patio/entrada_saida_veiculos',
    element: (
      <PrivateRoute>
        <OperacoesPatioEntradaVeiculos />
      </PrivateRoute>
    )
  },
  {
    path: '/operacoes_porto/agendada',
    element: (
      <PrivateRoute>
        <OperacoesPortoAgendada />
      </PrivateRoute>
    )
  }
]);

export default router;