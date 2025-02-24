export interface IOperacoesPatioEntradaVeiculos {
  id_operacao_patio_entrada_veiculo: number;
  data_hora: string;
  placa_dianteira: string;
  id_operacao_patio_cancela: number;
  placa_traseira: number;
  cancela: {
    id_operacao_patio_cancela: number;
    numero_cancela: number;
    tipo_cancela: number
  }
  numero_partes_nao_motorizada: number;
  identificadores_conteineres: string;
  semireboque1: boolean;
  semireboque2: boolean;
  data_historico: string;
  saida: {
    id_operacao_patio_cancela: number;
    id_operacao_patio_saida_veiculo: number;
    placa_dianteira: string;
    data_hora: string;
    cancela: {
      id_operacao_patio_cancela: number;
      numero_cancela: number;
      tipo_cancela: number
    }
  }
}