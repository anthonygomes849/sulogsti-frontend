import { IMotorista } from "../../../../../../../Cadastro/Motoristas/Create/types/types";
import { IVeiculos } from "../../../../../../../Cadastro/Veiculos/types/types";
import { ITriagens } from "../../../../../types/types";

export interface IPaymentTicket  {
  operacaoPatio: ITriagens;
  qtd_diaria: number;
  qtd_horas_extras: number;
  qtd_meia_diaria: number;
  tempo_permanencia: number;
  valor_a_pagar: number;
  valor_diaria: number;
  valor_hora_extra: number;
  valor_meia_diaria: number;
  valor_pago: number;
  valor_total: number;
  valor_total_estadia: number;
  valor_total_triagem: number;
  motorista: IMotorista;
  comercialCustoTriagem: {
    id_custo_triagem: number;
    custo_base_triagem: number;
    tempo_base_triagem: number;
  },
  comercialCustoEstadia: {
    id_custo_estadia: number;
    custo_diaria: number;
    custo_hora: number;
    custo_meia_diaria: number;
  },
  veiculo: IVeiculos;
}

export enum ITypePayment {
  BUMERANGUE = "BUMERANGUE",
  CARROSSEL = "CARROSSEL",
  FATURADO = "FATURADO",
  CARTAO_CREDITO = "CARTÃO DE CRÉDITO",
  CARTAO_DEBITO = "CARTÃO DE DEBITO",
  CARTAO_MANUAL_CRÉDITO = "CARTAO MANUAL CRÉDITO",
  CARTAO_MANUAL_DEBITO = "CARTAO MANUAL DEBITO",
  PIX = "PIX",
  DINHEIRO = "DINHEIRO"
}