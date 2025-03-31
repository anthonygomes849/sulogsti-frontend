import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import CheckMarker from "../../../../../../../assets/images/checkMarker.svg";
import Loading from "../../../../../../../core/common/Loading";
import api from "../../../../../../../services/api";
import Ticket from "../Payment/Ticket";
import { IPaymentTicket } from "../Payment/types/types";
// import { Container } from './styles';

interface Props {
  onClose: () => void;
}

const Invoiced: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [dataTicket, setDataTicket] = useState<IPaymentTicket>();
  const [showTicket, setShowTicket] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const getPaymentTicket = useCallback(async () => {
    try {
      setLoading(true);

      let getDataTriagem: any = sessionStorage.getItem("@triagem");
      if (getDataTriagem) {
        getDataTriagem = JSON.parse(getDataTriagem);
      }
      const idOperacaoPatio = sessionStorage.getItem("id_operacao_patio");

      const id =
        idOperacaoPatio && idOperacaoPatio.length > 0
          ? idOperacaoPatio
          : getDataTriagem?.id_operacao_patio;

      const body = {
        id_operacao_patio: id,
      };

      const response = await api.post("/operacaopatio/custoOperacao", body);

      if (response.status === 200) {
        setDataTicket(response.data);

        setShowTicket(true);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getPaymentTicket();
  }, [getPaymentTicket]);
  
  return (
    <>
    <Loading loading={loading} />
      {showTicket && (
        <div className="hidden">
          <Ticket
            numPages={1}
            data={dataTicket}
            onClose={() => setShowTicket(!showTicket)}
          />
        </div>
      )}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <div className="overflow-y-scroll max-h-[650px] p-10">
          <div className="w-full h-full flex items-center justify-center">
            <div className="flex items-center h-full">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full ${"bg-[#006400]"}`}
              >
                <img src={CheckMarker} />
              </div>
              <span className="ml-4 text-base text-[#000] font-bold">
                Triagem faturada com sucesso!
              </span>
            </div>
          </div>
          <div className="w-full h-full flex flex-col items-center justify-center mt-5">
            <div>
              <span>
                Valor horas extras:
              </span>
              <span className="ml-2 text-base text-[#000] font-bold">
                {dataTicket?.valor_hora_extra.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
              </span>

            </div>
            <div>
              <span>
                Valor estadia:
              </span>
              <span className="ml-2 text-base text-[#000] font-bold">
                {dataTicket?.valor_total_estadia.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
              </span>
            </div>
            <div>
              <span>
                Valor Triagem:
              </span>
              <span className="ml-2 text-base text-[#000] font-bold">
                {dataTicket?.valor_total_triagem.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
              </span>
            </div>
            <div>
              <span>
                Valor Total:
              </span>
              <span className="ml-2 text-base text-[#000] font-bold">
                {dataTicket?.valor_total.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          onClick={() => props.onClose()}
        >
          Finalizar
        </button>
      </div>
    </>
  );
};

export default Invoiced;
