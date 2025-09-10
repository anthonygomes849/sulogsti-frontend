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
  operacao_porto_carrossel: any;
  proprietario_carga: string;
  data_historico: string;
  operacao_patio_identificacao_veiculo?: {
    id_veiculo_parte_nao_motorizada: number;
    id_veiculo_parte_motorizada: number;
    tipo_veiculo: number;
  },
  pagamento?: any[];
  transportadora?: any;
  status: number;
}