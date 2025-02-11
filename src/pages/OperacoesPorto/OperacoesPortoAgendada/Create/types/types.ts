export interface IOperacoesPatioEntradaVeiculos {
  id_operacao_patio_entrada_veiculo: number;
  data_hora: string;
  placa_dianteira: string;
  id_operacao_patio_cancela: number;
  placa_traseira: number;
  numero_partes_nao_motorizada: number;
  identificadores_conteineres: string;
  semireboque1: boolean;
  semireboque2: boolean;
  data_historico: string;
}