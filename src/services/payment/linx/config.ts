/**
 * Linx Payment Configuration Service
 * Centralizes all Linx payment SDK configuration and environment settings
 * Uses lazy loading to avoid timeout issues
 */

export interface LinxPaymentConfig {
  readonly scriptUrl: string;
  readonly authenticationKey: string;
  readonly environment: 'development' | 'production';
  readonly timeout: number;
  readonly retryAttempts: number;
  readonly connectionTimeout: number;
  readonly readTimeout: number;
}

export interface LinxPaymentEnvironment {
  readonly development: LinxPaymentConfig;
  readonly production: LinxPaymentConfig;
}

/**
 * Cached configuration to avoid repeated initialization
 */
let cachedConfig: LinxPaymentConfig | null = null;

/**
 * Linx Payment Environment Configuration
 * Not directly exported to prevent immediate initialization
 */
const LINX_PAYMENT_ENVIRONMENTS: LinxPaymentEnvironment = {
  development: {
    scriptUrl: 'https://linxpaykitapi-hmg.linx.com.br/LinxPaykitApi/paykit-checkout.js',
    authenticationKey: '91749225000109',
    environment: 'development',
    timeout: 3000, // Increased timeout for development
    retryAttempts: 0,
    connectionTimeout: 15000,
    readTimeout: 30000,
  },
  production: {
    scriptUrl: 'https://linxpaykitapi.linx.com.br/LinxPaykitApi/paykit-checkout.js',
    authenticationKey: '91749225000109', // This should be different for production
    environment: 'production',
    timeout: -0,
    retryAttempts: 2,
    connectionTimeout: 10000,
    readTimeout: 20000,
  },
};

/**
 * Get current environment from Vite environment variables
 * Cached to avoid repeated calls
 */
let currentEnvironment: 'development' | 'production' | null = null;

const getCurrentEnvironment = (): 'development' | 'production' => {
  if (currentEnvironment === null) {
    currentEnvironment = import.meta.env.MODE === 'production' ? 'production' : 'development';
  }
  return currentEnvironment;
};

/**
 * Get Linx payment configuration for current environment
 * Uses lazy loading and caching to prevent timeout issues
 */
export const getLinxPaymentConfig = (): LinxPaymentConfig => {
  if (cachedConfig === null) {
    const environment = getCurrentEnvironment();
    cachedConfig = { ...LINX_PAYMENT_ENVIRONMENTS[environment] };
  }
  return cachedConfig;
};

/**
 * Get configuration asynchronously with timeout protection
 */
export const getLinxPaymentConfigAsync = async (): Promise<LinxPaymentConfig> => {
  return new Promise((resolve, reject) => {
    try {
      const config = getLinxPaymentConfig();
      
      // Simulate async operation with immediate resolution
      setTimeout(() => {
        resolve(config);
      }, 0);
      
    } catch (error) {
      // Fallback timeout
      setTimeout(() => {
        reject(new Error('Configuration loading timeout'));
      }, 5000);
    }
  });
};

/**
 * Validate Linx payment configuration
 */
export const validateLinxConfig = (config: LinxPaymentConfig): boolean => {
  return !!(
    config.scriptUrl &&
    config.authenticationKey &&
    config.environment &&
    config.retryAttempts > 0 &&
    config.connectionTimeout > 0 &&
    config.readTimeout > 0
  );
};

/**
 * Reset cached configuration (useful for testing or environment changes)
 */
export const resetConfigCache = (): void => {
  cachedConfig = null;
  currentEnvironment = null;
};

/**
 * Get configuration with fallback and error handling
 */
export const getLinxPaymentConfigSafe = (): LinxPaymentConfig | null => {
  try {
    const config = getLinxPaymentConfig();
    return validateLinxConfig(config) ? config : null;
  } catch (error) {
    console.error('Failed to get Linx payment configuration:', error);
    return null;
  }
};

/**
 * Default configuration export - now uses lazy loading
 * This prevents immediate initialization and potential timeout issues
 */
const getDefaultConfig = () => {
  try {
    return getLinxPaymentConfig();
  } catch (error) {
    console.warn('Using fallback configuration due to initialization error:', error);
    return LINX_PAYMENT_ENVIRONMENTS.development;
  }
};

export default getDefaultConfig;