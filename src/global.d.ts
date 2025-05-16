// globals.d.ts
export {};

declare global {
    interface Window {
        PaykitCheckout: any; // ou use o tipo correto se você souber
    }
}