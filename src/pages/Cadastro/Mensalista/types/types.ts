export interface IMensalista {
  id_mensalista: number;
  placa: string;
  data_historico: string;
  ativo: boolean;
  mensalista_transportadora: IMensalistaTransportadora;
}

export interface IMensalistaTransportadora {
  id_mensalista: number;
  id_transportadora: number;
  placa: string;
  razao_social_transportadora: string;
  data_historico: string;
  ativo: boolean;
}