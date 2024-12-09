export enum CategoriaCNH {
  ACC = "ACC",
  A = "A",
  B = "B",
  C = "C",
  D = "D",
  E = "E"
}

export interface IMotorista {
  id_motorista: number;
  cpf: string;
  nome: string;
  celular: string;
  numero_cnh: string;
  categoria_cnh: CategoriaCNH;
  data_expiracao_cnh: string;
  endereco: string;
  complemento: string;
  numero: string;
  bairro: string;
  id_bairro: string;
  cidade: string;
  id_cidade: string;
  uf_estado: string;
  id_estado: string;
  cep: string;
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