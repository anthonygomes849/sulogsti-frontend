
export type Options = {
  value: string | number;
  label: string;
};

export interface IProprietarioCargas {
  id_proprietario_carga: number;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  id_przpgto: number;
  periodo_faturamento: number;
  tipos_carga: string;
  telefone: string;
  celular: string;
  endereco: string;
  complemento: string;
  numero: string;
  bairro: string;
  cidade: string;
  id_bairro: string;
  id_cidade: string;
  uf_estado: string;
  id_estado: string;
  cep: string;
  email: string;
  contato: string;
  data_inativacao: string;
  dias_inativacao: string;
  motivo_inativacao: string;
  data_historico: string;
  ativo: boolean;
}

export interface States {
  id_estado: number;
  nome: string;
  uf: string;
  ativo: boolean;
}

export interface City {
  id_cidade: number;
  id_estado: number;
  nome: string;
  ativo: boolean;
}

export interface Neighborhood {
  id_bairro: number;
  id_cidade: number;
  nome: string;
  ativo: boolean;
}

export enum CargaType {
  CARGA_GERAL = "CARGA GERAL",
  COMBUSTIVEL = "COMBUSTÍVEL",
  CONTEINER = "CONTÊINER",
  GAS = "GÁS"
}

export enum BillingPeriod {
  SEMANAL = "SEMANAL",
  QUINZENAL = "QUINZENAL",
  MENSAL = "MENSAL",
  BIMESTRAL = "BIMESTRAL"
}

export interface PeriodPayment {
  id_przpgto: number;
  descricao: string;
}