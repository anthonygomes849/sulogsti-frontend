# Linx Payment Integration - Separated Configuration

This document outlines the modular Linx payment integration that has been implemented to separate configuration concerns and improve maintainability.

## Overview

The Linx payment integration has been refactored into a modular structure that separates configuration, utilities, types, and React hooks into distinct modules. This approach provides better code organization, easier testing, and improved maintainability.

## Architecture

### Directory Structure
```
src/services/payment/linx/
├── config.ts           # Environment-specific configuration
├── types.ts            # TypeScript interfaces and types
├── utils.ts            # Core payment utility functions
├── useLinxPayment.ts   # React hook for payment operations
└── index.ts            # Centralized exports
```

### Key Components

#### 1. Configuration Service (`config.ts`)
- **Purpose**: Centralizes all Linx payment SDK configuration
- **Features**:
  - Environment-specific settings (development/production)
  - Configuration validation
  - Centralized authentication keys and URLs
  - Timeout and retry settings

```typescript
import { getLinxPaymentConfig } from '@/services/payment/linx';

const config = getLinxPaymentConfig();
console.log(config.scriptUrl); // Environment-specific SDK URL
```

#### 2. Type Definitions (`types.ts`)
- **Purpose**: Provides comprehensive TypeScript support
- **Features**:
  - Payment method enums
  - SDK response/error interfaces
  - Application-specific payment data types
  - Global window interface extensions

```typescript
import { PaymentMethodType, LinxPaymentResponse } from '@/services/payment/linx';
```

#### 3. Utility Functions (`utils.ts`)
- **Purpose**: Core payment processing logic
- **Features**:
  - SDK initialization and authentication
  - Credit/debit payment processing
  - Payment method validation
  - Error handling and formatting

```typescript
import { initializeLinxSDK, processPaymentByMethod } from '@/services/payment/linx';

// Initialize SDK
await initializeLinxSDK();

// Process payment
processPaymentByMethod('4', 100.00, onSuccess, onError);
```

#### 4. React Hook (`useLinxPayment.ts`)
- **Purpose**: Provides React integration with state management
- **Features**:
  - Automatic SDK initialization
  - Payment state management
  - Error handling
  - Lifecycle management

```typescript
import { useLinxPayment } from '@/services/payment/linx';

const payment = useLinxPayment({
  autoInitialize: true,
  onPaymentSuccess: handleSuccess,
  onPaymentError: handleError,
});

// Process payment
await payment.processPayment('4', 100.00);
```

## Usage Examples

### Basic Payment Processing

```typescript
import { useLinxPayment, PaymentMethodType } from '@/services/payment/linx';

function PaymentComponent() {
  const payment = useLinxPayment({
    onPaymentSuccess: (response) => {
      console.log('Payment successful:', response);
    },
    onPaymentError: (error) => {
      console.error('Payment failed:', error);
    },
  });

  const handlePayment = async () => {
    await payment.processPayment(PaymentMethodType.CREDIT_CARD, 100.00);
  };

  return (
    <div>
      <button 
        onClick={handlePayment} 
        disabled={payment.isInitializing}
      >
        {payment.isInitializing ? 'Loading...' : 'Pay Now'}
      </button>
      {payment.error && (
        <div className="error">{payment.error}</div>
      )}
    </div>
  );
}
```

### Direct Utility Usage

```typescript
import { 
  initializeLinxSDK, 
  processCreditPayment,
  handlePaymentSuccess,
  handlePaymentError 
} from '@/services/payment/linx';

// Initialize SDK
await initializeLinxSDK();

// Process credit payment
processCreditPayment(
  100.00,
  handlePaymentSuccess,
  handlePaymentError,
  1 // installments
);
```

## Configuration Management

### Timeout Protection

The configuration has been redesigned to prevent timeout issues during initialization:

```typescript
import { 
  getLinxPaymentConfigSafe, 
  getLinxPaymentConfigAsync,
  resetConfigCache 
} from '@/services/payment/linx';

// Safe configuration loading (returns null if fails)
const config = getLinxPaymentConfigSafe();
if (config) {
  console.log('Configuration loaded successfully');
} else {
  console.error('Failed to load configuration');
}

// Async configuration loading with timeout protection
try {
  const config = await getLinxPaymentConfigAsync();
  console.log('Configuration loaded:', config);
} catch (error) {
  console.error('Configuration timeout:', error);
}

// Reset cache if environment changes
resetConfigCache();
```

### Environment Variables

The configuration automatically detects the environment and uses appropriate settings:

- **Development**: Uses Linx homologation environment with extended timeouts
- **Production**: Uses Linx production environment with optimized timeouts

### Timeout Settings

The new configuration includes multiple timeout settings:

- `connectionTimeout`: Time to wait for script loading (10-15s)
- `readTimeout`: Time to wait for authentication (20-30s)
- `timeout`: General operation timeout (30-45s)

### Custom Configuration

You can extend or override configuration:

```typescript
import { getLinxPaymentConfigSafe, validateLinxConfig } from '@/services/payment/linx';

const config = getLinxPaymentConfigSafe();
if (config) {
  // Extend with custom settings
  const customConfig = {
    ...config,
    connectionTimeout: 20000, // Custom timeout
  };
  
  if (validateLinxConfig(customConfig)) {
    // Configuration is valid
  }
}
```

## Error Handling

The integration provides comprehensive error handling:

```typescript
import { formatPaymentError, handlePaymentError } from '@/services/payment/linx';

const onError = (error: LinxPaymentError) => {
  const userFriendlyMessage = formatPaymentError(error);
  console.log(userFriendlyMessage); // "Pagamento cancelado pelo usuário"
  
  // Built-in error handling
  handlePaymentError(error);
};
```

## Migration Guide

### From Legacy Implementation

The old implementation scattered Linx payment logic throughout components. The new structure centralizes this logic:

**Before:**
```typescript
// Scattered across multiple components
const loadPaykitScript = () => { ... };
const authenticate = () => { ... };
const creditPayment = (value) => { ... };
```

**After:**
```typescript
// Centralized and typed
import { useLinxPayment } from '@/services/payment/linx';

const payment = useLinxPayment();
await payment.processPayment('4', 100.00);
```

### Benefits of Migration

1. **Type Safety**: Full TypeScript support with proper interfaces
2. **Error Handling**: Centralized and consistent error management
3. **Testing**: Easier to unit test individual modules
4. **Maintainability**: Clear separation of concerns
5. **Reusability**: Payment logic can be reused across components
6. **Configuration**: Environment-specific settings centralized

## Testing

The modular structure enables easier testing:

```typescript
import { processPaymentByMethod } from '@/services/payment/linx';

// Mock the SDK
jest.mock('window.PaykitCheckout');

// Test payment processing
test('processes credit payment', async () => {
  const onSuccess = jest.fn();
  const onError = jest.fn();
  
  processPaymentByMethod('4', 100.00, onSuccess, onError);
  
  expect(onSuccess).toHaveBeenCalled();
});
```

## Security Considerations

1. **Authentication Keys**: Stored in configuration with environment-specific values
2. **SDK Loading**: Secure script loading with error handling
3. **Payment Data**: Proper typing prevents data leakage
4. **Error Messages**: User-friendly error messages that don't expose sensitive information

## Performance Optimizations

1. **Lazy Loading**: SDK is loaded only when needed
2. **Caching**: SDK instance is cached to prevent reloading
3. **Error Recovery**: Automatic retry mechanisms for transient errors
4. **Memory Management**: Proper cleanup of event listeners and timeouts

## Future Enhancements

1. **Payment Analytics**: Integration with analytics services
2. **A/B Testing**: Support for payment flow experiments
3. **Multi-Payment**: Support for multiple payment processors
4. **Offline Support**: Handle offline payment scenarios
5. **Payment Scheduling**: Support for recurring payments

## Support

For issues or questions regarding the Linx payment integration:

1. Check the error messages and logs
2. Verify configuration settings
3. Test with different payment methods
4. Review the TypeScript interfaces for proper usage

## Contributing

When modifying the payment integration:

1. Update type definitions if adding new features
2. Add comprehensive error handling
3. Include unit tests for new functionality
4. Update this documentation
5. Test across different environments