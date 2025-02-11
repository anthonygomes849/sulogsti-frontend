import { ITerminal } from "../../../Cadastro/Terminal/Create/types/types";

export interface IOperacoesPortoAgendada {
  id_operacao_porto_agendada: number;
  identificadores_conteineres: string;
  placa_dianteira_veiculo: string;
  placa_traseira_veiculo: string;
  cpf_motorista: string;
  tipo_carga: number;
  tipo_operacao: number;
  data_agendamento_terminal: string;
  id_terminal: number;
  tolerancia_inicio_agendamento: number;
  tolerancia_fim_agendamento: number;
  cnpj_transportadora: string;
  terminal: ITerminal;
  data_historico: string;
}

export enum CargaType {
  CARGA_GERAL = "CARGA GERAL",
  COMBUSTIVEL = "COMBUSTÍVEL",
  CONTEINER = "CONTÊINER",
  GAS = "GÁS"
}

export enum OperationType {
  CARGA = "CARGA",
  DESCARGA = "DESCARGA"
}