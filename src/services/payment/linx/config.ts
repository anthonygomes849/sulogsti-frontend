/**
 * Linx Payment Configuration Service
 * Centralizes all Linx payment SDK configuration and environment settings
 */

export interface LinxPaymentConfig {
  readonly scriptUrl: string;
  readonly authenticationKey: string;
  readonly environment: 'development' | 'production';
  readonly timeout: number;
  readonly retryAttempts: number;
}

export interface LinxPaymentEnvironment {
  readonly development: LinxPaymentConfig;
  readonly production: LinxPaymentConfig;
}

/**
 * Linx Payment Environment Configuration
 */
const LINX_PAYMENT_ENVIRONMENTS: LinxPaymentEnvironment = {
  development: {
    scriptUrl: 'https://linxpaykitapi-hmg.linx.com.br/LinxPaykitApi/paykit-checkout.js',
    authenticationKey: '91749225000109',
    environment: 'development',
    timeout: 30000,
    retryAttempts: 3,
  },
  production: {
    scriptUrl: 'https://linxpaykitapi.linx.com.br/LinxPaykitApi/paykit-checkout.js',
    authenticationKey: '91749225000109', // This should be different for production
    environment: 'production',
    timeout: 30000,
    retryAttempts: 3,
  },
};

/**
 * Get current environment from Vite environment variables
 */
const getCurrentEnvironment = (): 'development' | 'production' => {
  return import.meta.env.MODE === 'production' ? 'production' : 'development';
};

/**
 * Get Linx payment configuration for current environment
 */
export const getLinxPaymentConfig = (): LinxPaymentConfig => {
  const environment = getCurrentEnvironment();
  return LINX_PAYMENT_ENVIRONMENTS[environment];
};

/**
 * Validate Linx payment configuration
 */
export const validateLinxConfig = (config: LinxPaymentConfig): boolean => {
  return !!(
    config.scriptUrl &&
    config.authenticationKey &&
    config.environment &&
    config.timeout > 0 &&
    config.retryAttempts > 0
  );
};

/**
 * Default configuration export
 */
export default getLinxPaymentConfig();