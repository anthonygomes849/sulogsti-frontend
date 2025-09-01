/**
 * useLinxPayment Hook
 * Custom React hook for managing Linx payment state and operations
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  initializeLinxSDK,
  processPaymentByMethod,
  handlePaymentSuccess,
  handlePaymentError,
  undoPayments,
  requiresLinxSDK,
  isLinxSDKLoaded,
  reprint,
} from './utils';
import type {
  LinxPaymentResponse,
  LinxPaymentError,
  PaymentMethodType,
  LinxReprintRequest,
} from './types';

export interface UseLinxPaymentOptions {
  autoInitialize?: boolean;
  onPaymentSuccess?: (response: LinxPaymentResponse) => void;
  onPaymentError?: (error: LinxPaymentError) => void;
}

export interface UseLinxPaymentReturn {
  // State
  isSDKLoaded: boolean;
  isAuthenticated: boolean;
  isInitializing: boolean;
  error: string | null;
  
  // Actions
  initializeSDK: () => Promise<void>;
  processPayment: (method: string, amount: number, installments?: number) => Promise<void>;
  cancelPayment: () => void;
  reprintPayment: (code: string) => void;
  
  // Utilities
  canProcessPayment: (method: string) => boolean;
  resetError: () => void;
}

/**
 * Custom hook for Linx payment operations
 */
export const useLinxPayment = (options: UseLinxPaymentOptions = {}): UseLinxPaymentReturn => {
  const {
    autoInitialize = true,
    onPaymentSuccess,
    onPaymentError,
  } = options;

  // State
  const [isSDKLoaded, setIsSDKLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const initializationPromiseRef = useRef<Promise<void> | null>(null);
  const authenticatedRef = useRef(false);

  /**
   * Initialize Linx SDK
   */
  const initializeSDK = useCallback(async (): Promise<void> => {
    if (isAuthenticated || isInitializing) {
      return;
    }

    // Return existing promise if initialization is in progress
    if (initializationPromiseRef.current) {
      return initializationPromiseRef.current;
    }

    setIsInitializing(true);
    setError(null);

    initializationPromiseRef.current = (async () => {
      try {
        await initializeLinxSDK();
        setIsSDKLoaded(true);
        setIsAuthenticated(true);
        authenticatedRef.current = true;
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize Linx SDK';
        setError(errorMessage);
        console.error('Linx SDK initialization failed:', err);
      } finally {
        setIsInitializing(false);
        initializationPromiseRef.current = null;
      }
    })();

    return initializationPromiseRef.current;
  }, [isAuthenticated, isInitializing]);

  /**
   * Process payment
   */
  const processPayment = useCallback(async (
    method: string,
    amount: number,
    installments: number = 1
  ): Promise<void> => {
    setError(null);

    // Initialize SDK if needed for card payments
    if (requiresLinxSDK(method) && !isAuthenticated) {
      await initializeSDK();
    }

    return new Promise((resolve, reject) => {
      const handleSuccess = (response: LinxPaymentResponse) => {
        handlePaymentSuccess(response);
        onPaymentSuccess?.(response);
        resolve();
      };

      const handleError = (error: LinxPaymentError) => {
        const errorMessage = `Payment failed: ${error.reason}`;
        setError(errorMessage);
        handlePaymentError(error);
        onPaymentError?.(error);
        reject(error);
      };

      try {
        processPaymentByMethod(method, amount, handleSuccess, handleError, installments);
      } catch (err) {
        const error: LinxPaymentError = {
          reasonCode: -1,
          reason: err instanceof Error ? err.message : 'Unknown error',
        };
        handleError(error);
      }
    });
  }, [isAuthenticated, initializeSDK, onPaymentSuccess, onPaymentError]);

  /**
   * Cancel/undo payment
   */
  const cancelPayment = useCallback((): void => {
    try {
      undoPayments();
    } catch (err) {
      console.error('Failed to cancel payment:', err);
    }
  }, []);
  

  const reprintPayment = useCallback((code: string): void => { 
    try {
      const request: LinxReprintRequest = {
        administrativeCode: code,
      };

      reprint(request);
    } catch (err) {
      console.error('Failed to reprint payment:', err);
    }
  }, []);

  /**
   * Check if payment method can be processed
   */
  const canProcessPayment = useCallback((method: string): boolean => {
    if (!requiresLinxSDK(method)) {
      return true; // Non-card payments can always be processed
    }
    
    return isAuthenticated && isSDKLoaded;
  }, [isAuthenticated, isSDKLoaded]);

  /**
   * Reset error state
   */
  const resetError = useCallback((): void => {
    setError(null);
  }, []);

  /**
   * Check SDK status on mount and when needed
   */
  useEffect(() => {
    const checkSDKStatus = () => {
      if (isLinxSDKLoaded()) {
        setIsSDKLoaded(true);
      }
    };

    checkSDKStatus();
    
    // Periodically check if SDK gets loaded externally
    const interval = setInterval(checkSDKStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Auto-initialize if enabled
   */
  useEffect(() => {
    if (autoInitialize && !authenticatedRef.current && !isInitializing) {
      initializeSDK().catch(() => {
        // Error is handled in initializeSDK
      });
    }
  }, [autoInitialize, initializeSDK, isInitializing]);

  /**
   * Handle beforeunload event to prevent data loss
   */
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isInitializing) {
        e.preventDefault();
        e.returnValue = 'Payment initialization in progress. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isInitializing]);

  return {
    // State
    isSDKLoaded,
    isAuthenticated,
    isInitializing,
    error,
    
    // Actions
    initializeSDK,
    processPayment,
    cancelPayment,
    reprintPayment,
    
    // Utilities
    canProcessPayment,
    resetError,
  };
};