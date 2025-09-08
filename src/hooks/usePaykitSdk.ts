import { useEffect, useState } from "react";
import type { LinxPaykitCheckout } from "../services/payment/linx/types";

export function usePaykitSdk() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.PaykitCheckout) {
      setLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://linxpaykitapi-hmg.linx.com.br/LinxPaykitApi/paykit-checkout.js"; // ⚠️ ajuste para URL real
    script.async = true;

    script.onload = () => {
      console.log("✅ Paykit SDK carregado");
      setLoaded(true);
    };

    script.onerror = (err) => {
      console.error("❌ Falha ao carregar SDK Paykit", err);
    };

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return loaded;
}