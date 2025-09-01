/**
 * Linx Payment Types and Interfaces
 * Defines all TypeScript types for Linx payment integration
 */

/**
 * Payment Method Types
 */
export enum PaymentMethodType {
  CREDIT_CARD = '4',
  DEBIT_CARD = '5',
}

/**
 * Payment Status Types
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  ERROR = 'error',
}

/**
 * Linx SDK Response Types
 */
export interface LinxPaymentResponse {
  success: boolean;
  administrativeCode?: number;
  receipt: {
    merchantReceipt: string;
    customerReceipt: string;
  };
  transactionId?: string;
  authorizationCode?: string;
  cardData?: {
    maskedNumber: string;
    brand: string;
  };
}

export interface LinxPaymentError {
  reasonCode: number;
  reason: string;
  message?: string;
}

/**
 * Payment Request Types
 */
export interface LinxCreditPaymentRequest {
  amount: number;
  requestKey?: string | null;
  installments?: number;
}

export interface LinxDebitPaymentRequest {
  amount: number;
  requestKey?: string | null;
}

export interface LinxAuthenticationRequest {
  authenticationKey: string;
}

export interface LinxReprintRequest {
  administrativeCode: string;
}

/**
 * Payment Callbacks
 */
export type LinxPaymentSuccessCallback = (response: LinxPaymentResponse) => void;
export type LinxPaymentErrorCallback = (error: LinxPaymentError) => void;
export type LinxAuthenticationSuccessCallback = (response: any) => void;
export type LinxAuthenticationErrorCallback = (error: LinxPaymentError) => void;
export type LinxPendingPaymentsCallback = (response: any) => void;

/**
 * Linx SDK Window Interface
 */
export interface LinxPaykitCheckout {
  authenticate: (
    request: LinxAuthenticationRequest,
    onSuccess: LinxAuthenticationSuccessCallback,
    onError: LinxAuthenticationErrorCallback,
    onPendingPayments: LinxPendingPaymentsCallback
  ) => any;
  creditPayment: (
    request: LinxCreditPaymentRequest,
    onSuccess: LinxPaymentSuccessCallback,
    onError: LinxPaymentErrorCallback
  ) => any;
  debitPayment: (
    request: LinxDebitPaymentRequest,
    onSuccess: LinxPaymentSuccessCallback,
    onError: LinxPaymentErrorCallback
  ) => any;
  undoPayments: () => any;
  reprint: (
    request: LinxReprintRequest,
  ) => any;
}

/**
 * Extended Window interface for Linx SDK
 */
declare global {
  interface Window {
    PaykitCheckout?: LinxPaykitCheckout;
  }
}

/**
 * Application Payment Data Types
 */
export interface PaymentFormData {
  tipo_pagamento: string;
  desconto: string;
  valor_pago: string;
  cpf_supervisor: string;
}

export interface PaymentTicketData {
  valor_total_triagem: number;
  valor_hora_extra: number;
  valor_total_estadia: number;
  valor_pago: number;
  valor_a_pagar: number;
  operacaoPatio: {
    id_operacao_patio: string;
    pagamento?: Array<{
      tipo_pagamento: number;
      quantia_paga: number;
    }>;
    operacao_porto_agendada?: {
      data_agendamento_terminal: string;
    };
  };
  motorista?: {
    nome: string;
  };
  comercialCustoTriagem?: {
    tempo_base_triagem: number;
    custo_base_triagem: number;
  };
  comercialCustoEstadia?: {
    custo_hora: number;
    custo_meia_diaria: number;
    custo_diaria: number;
  };
}

export interface PaymentTypeOption {
  value: string;
  label: string;
}