/**
 * Linx Payment Utilities
 * Common utility functions for Linx payment integration
 */

import { FrontendNotification } from '../../../shared/Notification';
import { getLinxPaymentConfig, validateLinxConfig } from './config';
import type {
  LinxPaymentResponse,
  LinxPaymentError,
  LinxCreditPaymentRequest,
  LinxDebitPaymentRequest,
  LinxAuthenticationRequest,
  LinxPaymentSuccessCallback,
  LinxPaymentErrorCallback,
  LinxAuthenticationSuccessCallback,
  LinxAuthenticationErrorCallback,
  LinxPendingPaymentsCallback,
  LinxReprintRequest,
  LinxCancelPaymentRequest,
} from './types';
import { PaymentMethodType } from './types';

/**
 * Check if Linx SDK is loaded
 */
export const isLinxSDKLoaded = (): boolean => {
  return typeof window !== 'undefined' && !!window.PaykitCheckout;
};

/**
 * Load Linx Paykit SDK script
 */
export const loadLinxPaykitScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // If already loaded, resolve immediately
    if (isLinxSDKLoaded()) {
      resolve();
      return;
    }

    const config = getLinxPaymentConfig();

    // Validate configuration
    if (!validateLinxConfig(config)) {
      reject(new Error('Invalid Linx payment configuration'));
      return;
    }

    // Check if script already exists
    const existingScript = document.querySelector(`script[src="${config.scriptUrl}"]`);
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Linx SDK')));
      return;
    }

    // Create and load script
    const script = document.createElement('script');
    script.src = config.scriptUrl;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Linx SDK'));

    document.body.appendChild(script);
  });
};

/**
 * Initialize Linx SDK with authentication
 */
export const initializeLinxSDK = async (): Promise<any> => {
  try {
    await loadLinxPaykitScript();

    if (!isLinxSDKLoaded()) {
      throw new Error('Linx SDK not available after loading');
    }

    return new Promise((resolve, reject) => {
      const config = getLinxPaymentConfig();

      const authenticationRequest: LinxAuthenticationRequest = {
        authenticationKey: config.authenticationKey,
      };

      const onAuthenticationSuccess: LinxAuthenticationSuccessCallback = (response) => {
        console.log('Linx authentication successful', response);
        resolve(response);
      };

      const onAuthenticationError: LinxAuthenticationErrorCallback = (error) => {
        console.error('Linx authentication error', error);
        reject(error);
      };

      const onPendingPayments: LinxPendingPaymentsCallback = (response) => {
        console.log('Pending payments found', response);
        if (window.PaykitCheckout) {
          window.PaykitCheckout.undoPayments();
        }
      };

      if (window.PaykitCheckout) {
        window.PaykitCheckout.authenticate(
          authenticationRequest,
          onAuthenticationSuccess,
          onAuthenticationError,
          onPendingPayments
        );
      } else {
        reject(new Error('PaykitCheckout not available'));
      }
    });
  } catch (error) {
    console.error('Failed to initialize Linx SDK:', error);
    throw error;
  }
};

/**
 * Process credit card payment
 */
export const processCreditPayment = (
  amount: number,
  onSuccess: LinxPaymentSuccessCallback,
  onError: LinxPaymentErrorCallback,
  installments: number = 1
): any => {
  if (!isLinxSDKLoaded()) {
    const error: LinxPaymentError = {
      reasonCode: -1,
      reason: 'Linx SDK not loaded',
      message: 'Please ensure Linx SDK is properly loaded before processing payments'
    };
    onError(error);
    return null;
  }

  const creditRequest: LinxCreditPaymentRequest = {
    amount: parseFloat(amount.toString()),
    requestKey: null,
    installments,
  };

  return window.PaykitCheckout!.creditPayment(creditRequest, onSuccess, onError);
};

/**
 * Process debit card payment
 */
export const processDebitPayment = (
  amount: number,
  onSuccess: LinxPaymentSuccessCallback,
  onError: LinxPaymentErrorCallback
): any => {
  if (!isLinxSDKLoaded()) {
    const error: LinxPaymentError = {
      reasonCode: -1,
      reason: 'Linx SDK not loaded',
      message: 'Please ensure Linx SDK is properly loaded before processing payments'
    };
    onError(error);
    return null;
  }

  const debitRequest: LinxDebitPaymentRequest = {
    amount: parseFloat(amount.toString()),
    requestKey: null,
  };

  return window.PaykitCheckout!.debitPayment(debitRequest, onSuccess, onError);
};

/**
 * Cancel/undo payments
 */
export const undoPayments = (): any => {
  if (!isLinxSDKLoaded()) {
    console.warn('Linx SDK not loaded, cannot undo payments');

    return null;
  }

  return window.PaykitCheckout!.undoPayments();
};

export const reprint = (request: LinxReprintRequest, onSuccess: LinxPaymentSuccessCallback, onError: LinxPaymentErrorCallback): any => {
  if (!isLinxSDKLoaded()) {
    const error: LinxPaymentError = {
      reasonCode: -1,
      reason: 'Linx SDK not loaded',
      message: 'Please ensure Linx SDK is properly loaded before processing payments'
    };
    onError(error);
    return null;
  }




  return window.PaykitCheckout!.reprint(request, onSuccess, onError);
};

export const revertPayment = (request: LinxCancelPaymentRequest, onSuccess: LinxPaymentSuccessCallback, onError: LinxPaymentErrorCallback): any => {
  if (!isLinxSDKLoaded()) {
    const error: LinxPaymentError = {
      reasonCode: -1,
      reason: 'Linx SDK not loaded',
      message: 'Please ensure Linx SDK is properly loaded before processing payments'
    };
    onError(error);
    return null;
  }




  return window.PaykitCheckout!.paymentReversal(request, onSuccess, onError);
};

/**
 * Determine if payment method requires Linx SDK
 */
export const requiresLinxSDK = (paymentMethod: string): boolean => {
  return paymentMethod === PaymentMethodType.CREDIT_CARD ||
    paymentMethod === PaymentMethodType.DEBIT_CARD
};

/**
 * Process payment based on method type
 */
export const processPaymentByMethod = (
  paymentMethod: string,
  amount: number,
  onSuccess: LinxPaymentSuccessCallback,
  onError: LinxPaymentErrorCallback,
  installments: number = 1
): any => {
  switch (paymentMethod) {
    case PaymentMethodType.CREDIT_CARD:
      return processCreditPayment(amount, onSuccess, onError, installments);

    case PaymentMethodType.DEBIT_CARD:
      return processDebitPayment(amount, onSuccess, onError);

    default:
      // For non-card payments, call success immediately
      const response: LinxPaymentResponse = {
        success: true,
        receipt: {
          merchantReceipt: 'Non-card payment processed',
          customerReceipt: 'Non-card payment processed',
        },
      };
      onSuccess(response);
      return null;
  }
};

/**
 * Format payment error message
 */
export const formatPaymentError = (error: LinxPaymentError): string => {
  const errorMessages: Record<number, string> = {
    9: 'Pagamento cancelado pelo usuário',
    1: 'Erro de comunicação',
    2: 'Cartão inválido',
    3: 'Transação negada',
    4: 'Cartão bloqueado',
    5: 'Saldo insuficiente',
    6: 'Senha incorreta',
    7: 'Erro no terminal',
    8: 'Transação não permitida',
  };

  return errorMessages[error.reasonCode] || error.reason || 'Erro desconhecido no pagamento';
};

/**
 * Handle payment success with notification
 */
export const handlePaymentSuccess = (response: LinxPaymentResponse, message: string): void => {
  console.log('Payment successful:', response);

    FrontendNotification(message, 'success');
};

/**
 * Handle payment error with notification
 */
export const handlePaymentError = (error: LinxPaymentError): void => {
  console.error('Payment error:', error);
  const errorMessage = formatPaymentError(error);
  FrontendNotification(errorMessage, 'error');

  // Auto-cancel if user cancelled
  if (error.reasonCode === 9) {
    undoPayments();
  }
};