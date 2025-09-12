/**
 * Linx Payment Integration Module
 * Centralized exports for all Linx payment functionality
 */

// Configuration
export { 
  getLinxPaymentConfig, 
  getLinxPaymentConfigAsync,
  getLinxPaymentConfigSafe,
  validateLinxConfig,
  resetConfigCache
} from './config';
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