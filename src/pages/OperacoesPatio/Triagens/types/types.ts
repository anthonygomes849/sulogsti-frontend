import { IOperacoesPortoAgendada } from "../../../OperacoesPorto/OperacoesPortoAgendada/types/types";
import { IOperacoesPatioEntradaVeiculos } from "../../OperacoesPatioEntradaVeiculos/Create/types/types";

export interface ITriagens {
  id_operacao_patio: number;
  entrada_veiculo: IOperacoesPatioEntradaVeiculos;
  chamada_motorista: boolean;
  id_operacao_patio_entrada_veiculo: number;
  id_operacao_porto_agendada?: number;
  id_operacao_porto_carrossel?: number;
  operacao_porto_agendada: IOperacoesPortoAgendada;
}