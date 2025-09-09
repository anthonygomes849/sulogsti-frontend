import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { usePaykitSdk } from "./usePaykitSdk";
import type {
  LinxAuthenticationRequest,
  LinxCreditPaymentRequest,
  LinxDebitPaymentRequest,
  LinxPaymentResponse,
  LinxPaymentError,
  LinxPaykitCheckout,
  LinxCancelPaymentRequest,
  LinxReprintRequest
} from "../services/payment/linx/types";
import { FrontendNotification } from "../shared/Notification";
import { ToastContainer } from "react-toastify";

interface PaykitContextProps {
    authenticated: boolean;
    loading: boolean;
    error: string | null;
    authenticate: (authKey?: string) => Promise<void>;
    creditPayment: (
        request: LinxCreditPaymentRequest,
        onSuccess: (response: LinxPaymentResponse) => void,
        onError: (error: LinxPaymentError) => void
    ) => void;
    debitPayment: (
        request: LinxDebitPaymentRequest,
        onSuccess: (response: LinxPaymentResponse) => void,
        onError: (error: LinxPaymentError) => void
    ) => void;
    undoPayments: () => void;
    reveralPayment: (
        request: LinxCancelPaymentRequest,
        onSuccess: (response: LinxPaymentResponse) => void,
        onError: (error: LinxPaymentError) => void
    ) => void;
    reprint: (
        request: LinxReprintRequest,
        onSuccess: (response: LinxPaymentResponse) => void,
        onError: (error: LinxPaymentError) => void
    ) => void;
    checkout: LinxPaykitCheckout | null;
}

const PaykitContext = createContext<PaykitContextProps | undefined>(undefined);

export const PaykitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const sdkLoaded = usePaykitSdk();
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [checkout, setCheckout] = useState<LinxPaykitCheckout | null>(null);

    const authenticate = useCallback(async (authKey?: string) => {
        if (!sdkLoaded || !window.PaykitCheckout) {
            const errorMsg = "PaykitCheckout SDK not loaded yet";
            console.error("⚠️", errorMsg);
            setError(errorMsg);
            throw new Error(errorMsg);
        }

        setLoading(true);
        setError(null);

        return new Promise<void>((resolve, reject) => {
            const authenticationRequest: LinxAuthenticationRequest = {
                authenticationKey: authKey || "91749225000109", // Default or from parameter
            };

            const onAuthenticationSuccess = (response: any) => {
                console.log("✅ Authentication successful", response);
                setAuthenticated(true);
                setLoading(false);
                resolve();
            };

            const onAuthenticationError = (error: LinxPaymentError) => {
                console.error("❌ Authentication error:", error);
                setLoading(false);
                setAuthenticated(false);
                
                let errorMessage = error.reason || "Authentication failed";
                if (error.reasonCode === 8) {
                    errorMessage = "Another Paykit session is already open in another tab/window.";
                }
                
                setError(errorMessage);
                reject(new Error(errorMessage));
            };

            const onPendingPayments = (response: any) => {
                console.warn("⚠️ Pending payments found:", response);
                if (window.PaykitCheckout) {
                    try {
                        const checkoutInstance = window.PaykitCheckout.undoPayments();
                        setCheckout(checkoutInstance);
                        console.log("✅ Pending payments cleared");
                    } catch (err) {
                        console.error("❌ Error clearing pending payments:", err);
                    }
                }
            };

            try {
                if (!window.PaykitCheckout) {
                    throw new Error("PaykitCheckout is not available");
                }
                
                const checkoutInstance = window.PaykitCheckout.authenticate(
                    authenticationRequest,
                    onAuthenticationSuccess,
                    onAuthenticationError,
                    onPendingPayments
                );
                setCheckout(checkoutInstance);
            } catch (err) {
                console.error("❌ Error during authentication:", err);
                setLoading(false);
                const errorMessage = "Failed to initialize authentication";
                setError(errorMessage);
                reject(new Error(errorMessage));
            }
        });
    }, [sdkLoaded]);

    const creditPayment = useCallback(
        (
            request: LinxCreditPaymentRequest,
            onSuccess: (response: LinxPaymentResponse) => void,
            onError: (error: LinxPaymentError) => void
        ) => {
            if (!window.PaykitCheckout) {
                const error: LinxPaymentError = {
                    reasonCode: -1,
                    reason: "SDK not loaded or not authenticated"
                };
                onError(error);
                return;
            }

            try {
                window.PaykitCheckout.creditPayment(
                    request,
                    (response: LinxPaymentResponse) => {
                        onSuccess(response);
                    },
                    (error: LinxPaymentError) => {
                        FrontendNotification(error.reason, "warning")
                        onError(error);
                    }
                );
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -999,
                    reason: "Internal SDK error",
                    message: err instanceof Error ? err.message : String(err)
                };
                onError(error);
            }
        },
        [authenticated]
    );

    const debitPayment = useCallback(
        (
            request: LinxDebitPaymentRequest,
            onSuccess: (response: LinxPaymentResponse) => void,
            onError: (error: LinxPaymentError) => void
        ) => {
            if (!window.PaykitCheckout) {
                const error: LinxPaymentError = {
                    reasonCode: -1,
                    reason: "SDK not loaded or not authenticated"
                };
                onError(error);
                return;
            }

            try {
                window.PaykitCheckout.debitPayment(
                    request,
                    (response: LinxPaymentResponse) => {
                        onSuccess(response);
                    },
                    (error: LinxPaymentError) => {
                        FrontendNotification(error.reason, "warning");
                        onError(error);
                    }
                );
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -999,
                    reason: "Internal SDK error",
                    message: err instanceof Error ? err.message : String(err)
                };
                onError(error);
            }
        },
        [authenticated]
    );
    
    const reveralPayment = useCallback(
        (
            request: LinxCancelPaymentRequest,
            onSuccess: (response: LinxPaymentResponse) => void,
            onError: (error: LinxPaymentError) => void
        ) => {
            if (!authenticated || !window.PaykitCheckout) {
                const error: LinxPaymentError = {
                    reasonCode: -1,
                    reason: "SDK not loaded or not authenticated"
                };
                onError(error);
                return;
            }

            try {
                window.PaykitCheckout.paymentReversal(
                    request,
                    (response: LinxPaymentResponse) => {
                        onSuccess(response);
                    },
                    (error: LinxPaymentError) => {
                        FrontendNotification(error.reason, "warning");
                        onError(error);
                    }
                );
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -999,
                    reason: "Internal SDK error",
                    message: err instanceof Error ? err.message : String(err)
                };
                onError(error);
            }
        },
        [authenticated]
    );

    const reprint = useCallback(
        (
            request: LinxReprintRequest,
            onSuccess: (response: LinxPaymentResponse) => void,
            onError: (error: LinxPaymentError) => void
        ) => {
            console.log(authenticate)
            // if (!window.PaykitCheckout) {
            //     const error: LinxPaymentError = {
            //         reasonCode: -1,
            //         reason: "SDK not loaded or not authenticated"
            //     };
            //     onError(error);
            //     return;
            // }

            try {
                console.log("entrou")
                window.PaykitCheckout!.reprint(
                    request,
                    (response: LinxPaymentResponse) => {
                        onSuccess(response);
                    },
                    (error: LinxPaymentError) => {
                        console.log("erro", error)
                        FrontendNotification(error.reason, "warning");
                        onError(error);
                    }
                );
            } catch (err) {
                const error: LinxPaymentError = {
                    reasonCode: -999,
                    reason: "Internal SDK error",
                    message: err instanceof Error ? err.message : String(err)
                };
                onError(error);
            }
        },
        [authenticated]
    );


    const undoPayments = useCallback(() => {
        if (!window.PaykitCheckout) {
            return;
        }

        try {
            const result = window.PaykitCheckout.undoPayments();
            return result;
        } catch (err) {
        }
    }, []);

    // Auto-authenticate when SDK is ready
    useEffect(() => {
        if (sdkLoaded && !authenticated && !loading) {
            authenticate().catch((err) => {
                console.error("Auto-authentication failed:", err);
            });
        }
    }, []);

    return (
        <PaykitContext.Provider 
            value={{ 
                authenticated, 
                loading, 
                error, 
                authenticate, 
                checkout, 
                creditPayment, 
                debitPayment,
                undoPayments,
                reveralPayment,
                reprint
            }}
        >
                  <ToastContainer />

            {children}
        </PaykitContext.Provider>
    );
};

export const usePaykit = () => {
    const ctx = useContext(PaykitContext);
    if (!ctx) throw new Error("usePaykit deve ser usado dentro de PaykitProvider");
    return ctx;
};