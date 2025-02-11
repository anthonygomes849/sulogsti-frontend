export interface IOperacoesPatioServicos {
  id_operacao_patio_servico: number;
  placa: string;
  id_operacao_patio_entrada_veiculo: number;
  id_tipo_servico: number;
  entrada_veiculo: {
    placa_dianteira: string;
    data_hora: string;
    id_operacao_patio_entrada_veiculo: number;
  };
  saida_veiculo: {
    placa_dianteira: string;
    data_hora: string;
  };
  tipo_servico: {
    id_tipo_servico: number;
    tipo_servico: string;
  }
  ativo: boolean;
  data_historico: string;
}