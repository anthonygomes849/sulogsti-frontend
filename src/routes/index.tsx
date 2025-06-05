import { createBrowserRouter } from "react-router-dom";
import ListMensalista from "../pages/Cadastro/Mensalista";
import ListMotorista from "../pages/Cadastro/Motoristas";
import Terminal from "../pages/Cadastro/Terminal";
import ListVeiculo from "../pages/Cadastro/Veiculos";
import ListTipoServico from "../pages/Configuracoes/TipoServico";
import Login from "../pages/Login";
import RedefinicaoSenha from "../pages/RedefinicaoSenha";
import OperacoesPatioEntradaVeiculos from "../pages/OperacoesPatio/OperacoesPatioEntradaVeiculos";
import ListOperacoesPatioServicos from "../pages/OperacoesPatio/OperacoesPatioServicos";
import Triagens from "../pages/OperacoesPatio/Triagens";
import OperacoesPortoAgendada from "../pages/OperacoesPorto/OperacoesPortoAgendada";
import PrivateRoute from "./privateRoute";
import Route from "./route";
import Transportadoras from "../pages/Cadastro/Transportadoras";
import ProprietarioCargas from "../pages/Cadastro/ProprietarioCargas";

/**
 * `router` is a configuration object used to define the routes for a React application, utilizing the `createBrowserRouter` function.
 * This configuration includes multiple routes corresponding to different paths and their respective components. Some routes are wrapped with
 * a `PrivateRoute` component to restrict access to authenticated users.
 *
 * Route definitions:
 * - `/`: Displays the `Login` component.
 * - `/redefinicaoSenha`: Displays the `RedefinicaoSenha` component.
 * - `/cadastros/veiculos`: Protected route displaying `ListVeiculo` for authenticated users.
 * - `/cadastros/motoristas`: Protected route displaying `ListMotorista` for authenticated users.
 * - `/cadastros/transportadoras`: Protected route displaying `Transportadoras` for authenticated users.
 * - `/cadastros/motoristas/adicionar`: Protected route displaying `ListMotorista` for authenticated users when adding drivers.
 * - `/cadastros/mensalistas`: Protected route displaying `ListMensalista`.
 * - `/cadastros/terminais`: Protected route displaying the `Terminal` component.
 * - `/operacoes_patio/servicos`: Protected route displaying `ListOperacoesPatioServicos`.
 * - `/configuracoes/tipos_servicos`: Protected route displaying `ListTipoServico`.
 * - `/operacoes_patio/entrada_saida_veiculos`: Protected route displaying `OperacoesPatioEntradaVeiculos`.
 * - `/operacoes_patio/triagens`: Protected route displaying `Triagens`.
 * - `/operacoes_porto/agendada`: Protected route displaying `OperacoesPortoAgendada`.
 *
 * Components wrapped with `PrivateRoute` indicate that user authentication is required to access those routes.
 */
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
    path: '/redefinicaoSenha',
    element: (
      <Route>
        <RedefinicaoSenha />
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
    path: '/cadastros/transportadoras',
    element: (
        <PrivateRoute>
          <Transportadoras />
        </PrivateRoute>
    )
  },
  {
    path: '/cadastros/proprietario_cargas',
    element: (
      <PrivateRoute>
        <ProprietarioCargas />
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
    path: '/cadastros/terminais',
    element: (
        <PrivateRoute>
          <Terminal />
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
    path: '/operacoes_patio/entrada_saida_veiculos',
    element: (
      <PrivateRoute>
        <OperacoesPatioEntradaVeiculos />
      </PrivateRoute>
    )
  },
  {
    path: 'operacoes_patio/triagens',
    element: (
      <PrivateRoute>
        <Triagens />
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
  },
]);

export default router;