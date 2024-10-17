export default interface Veiculo {
  id_veiculo: number;
  placa: string;
  id_estado: number | null;
  tipo_parte_veiculo: string | null;
  renavam: string | null;
  ano_exercicio_crlv: string;
  rntrc: string | null;
  data_expiracao_rntrc: string;
  livre_acesso_patio: boolean;
  ativo: boolean;
  data_historico: string;
  id_usuario_historico: number | null;
  data_inativacao: string | null;
  motivo_inativacao: string | null;
  status: string | null;
}