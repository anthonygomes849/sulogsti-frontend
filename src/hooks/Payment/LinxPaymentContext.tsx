import { useCallback, useEffect, useRef, useState } from "react";
import { LinxCancelPaymentRequest, LinxPaymentError, LinxPaymentResponse, LinxReprintRequest } from "./types";
import { handlePaymentError, handlePaymentSuccess, initializeLinxSDK, isLinxSDKLoaded, processPaymentByMethod, reprint, requiresLinxSDK, revertPayment, undoPayments } from "./utils";

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
    reprintPayment: (code: string) => Promise<void>;
    cancelPayments: (request: LinxCancelPaymentRequest) => Promise<void>;

    // Utilities
    canProcessPayment: (method: string) => boolean;
    resetError: () => void;
}

export const useLinxPayment = (options: UseLinxPaymentOptions = {  }): UseLinxPaymentReturn => {
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
                handlePaymentSuccess(response, 'Pagamento realizado com sucesso!');
                options.onPaymentSuccess?.(response);
                resolve();
            };

            const handleError = (error: LinxPaymentError) => {
                const errorMessage = `Payment failed: ${error.reason}`;
                setError(errorMessage);
                handlePaymentError(error);
                options.onPaymentError?.(error);
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
    }, [isAuthenticated, initializeSDK, options.onPaymentSuccess, options.onPaymentError]);

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

    /**
     * Reimpressão comprovante especifico
     */
    const reprintPayment = useCallback((code: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            const handleSuccess = (response: LinxPaymentResponse) => {
                handlePaymentSuccess(response, 'Reimpressão realizado com sucesso!');
                options.onPaymentSuccess?.(response);
                resolve();
            };

            const handleError = (error: LinxPaymentError) => {
                const errorMessage = `Payment failed: ${error.reason}`;
                setError(errorMessage);
                handlePaymentError(error);
                options.onPaymentError?.(error);
                reject(error);
            };

            try {
                const request: LinxReprintRequest = {
                    administrativeCode: code,
                };

                reprint(request, handleSuccess, handleError);
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -1,
                    reason: err instanceof Error ? err.message : 'Unknown error',
                };
                handleError(error);
            }
        });

    }, []);

    const cancelPayments = useCallback((request: LinxCancelPaymentRequest): Promise<void> => {
        return new Promise((resolve, reject) => {
            const handleSuccess = (response: LinxPaymentResponse) => {
                handlePaymentSuccess(response, 'Cancelamento do Pagamento realizado com sucesso!');
                options.onPaymentSuccess?.(response);
                resolve();
            };

            const handleError = (error: LinxPaymentError) => {
                const errorMessage = `Payment failed: ${error.reason}`;
                setError(errorMessage);
                handlePaymentError(error);
                options.onPaymentError?.(error);
                reject(error);
            };

            try {


                revertPayment(request, handleSuccess, handleError);
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -1,
                    reason: err instanceof Error ? err.message : 'Unknown error',
                };
                handleError(error);
            }
        });

    }, []);

    /**
     * Check if payment method requires Linx SDK    
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

    useEffect(() => {
        const checkSDKStatus = () => {
            if (isLinxSDKLoaded()) {
                setIsSDKLoaded(true);
            }
        };

        checkSDKStatus();

    }, []);

    useEffect(() => {
        if (options.autoInitialize) {
            initializeSDK().catch(() => { });
        }
    }, []);

    /**
     * Handle beforeunload event
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
        isSDKLoaded,
        isAuthenticated,
        isInitializing,
        error,
        initializeSDK,
        processPayment,
        cancelPayment,
        reprintPayment,
        cancelPayments,
        canProcessPayment,
        resetError,
    };

}