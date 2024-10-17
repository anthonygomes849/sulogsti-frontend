import Veiculo from "../model/Veiculo";
import VeiculoRepository from "./VeiculoRepository";

export default class ApiVeiculo implements VeiculoRepository {

  async getVeiculos(): Promise<Veiculo[]> {
    return [
      {
        id_veiculo: 1,
        placa: 'PGY-0000',
        ano_exercicio_crlv: '2024',
        ativo: true,
        data_expiracao_rntrc: '2024-10-24T12:00:00',
        data_historico: '2024-10-24T12:00:00',
        data_inativacao: '2024-10-24T12:00:00',
        id_estado: null,
        id_usuario_historico: null,
        livre_acesso_patio: true,
        motivo_inativacao: null,
        renavam: null,
        rntrc: null,
        status: "ACTIVE",
        tipo_parte_veiculo: null
      }
    ]
  }
}