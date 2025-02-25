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
  
}

export enum ITypePayment {
  BUMERANGUE = "BUMERANGUE",
  CARROSSEL = "CARROSSEL",
  FATURADO = "FATURADO",
  CARTAO_CREDITO = "CARTÃO DE CRÉDITO",
  CARTAO_DEBITO = "CARTÃO DE DEBITO",
  CARTAO_MANUAL_CRÉDITO = "CARTAO MANUAL CRÉDITO",
  PIX = "PIX",
  DINHEIRO = "DINHEIRO"
}