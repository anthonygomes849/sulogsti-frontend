export interface IVeiculos {
  id_veiculo: number;
  placa: string;
  uf_estado: string;
  tipo_parte_veiculo: boolean;
  renavam: string;
  rntrc: string;
  data_expiracao_rntrc: string;
  ano_exercicio_crlv: number;
  livre_acesso_patio: boolean;
  tipo_veiculo: string;
  data_inativacao: string;
  dias_inativacao: string;
  motivo_inativacao: string;
  data_historico: string;
}

export enum TipoVeiculo {
  TRUCK = "TRUCK",
  CARRETA = "CARRETA",
  BITREM = "BITREM",
}