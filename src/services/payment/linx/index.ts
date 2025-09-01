/**
 * Linx Payment Integration Module
 * Centralized exports for all Linx payment functionality
 */

// Configuration
export { default as linxPaymentConfig, getLinxPaymentConfig, validateLinxConfig } from './config';
export type { LinxPaymentConfig, LinxPaymentEnvironment } from './config';

// Types
export * from './types';

// Utilities
export * from './utils';

// Hook
export { useLinxPayment } from './useLinxPayment';
export type { UseLinxPaymentOptions, UseLinxPaymentReturn } from './useLinxPayment';

// Re-export commonly used functions for convenience
export {
  initializeLinxSDK,
  processCreditPayment,
  processDebitPayment,
  processPaymentByMethod,
  undoPayments,
  requiresLinxSDK,
  isLinxSDKLoaded,
  handlePaymentSuccess,
  handlePaymentError,
} from './utils';