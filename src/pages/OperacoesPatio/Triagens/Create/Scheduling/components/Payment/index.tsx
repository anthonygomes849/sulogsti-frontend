import { motion } from "framer-motion";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../../../components/InputCustom";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import api from "../../../../../../../services/api";
import Ticket from "./Ticket";
import { IPaymentTicket, ITypePayment } from "./types/types";

// import { Container } from './styles';

const Payment: React.FC = () => {
  const [dataTicket, setDataTicket] = useState<IPaymentTicket>();
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const getPaymentTicket = useCallback(async () => {
    try {
      setLoading(true);

      let getDataTriagem: any = sessionStorage.getItem('@triagem');
      if(getDataTriagem) {
        getDataTriagem = JSON.parse(getDataTriagem);
      }

      const body = {
        id_operacao_patio: getDataTriagem?.id_operacao_patio,
      };

      const response = await api.post("/operacaopatio/custoOperacao", body);

      if (response.status === 200) {
        setDataTicket(response.data);
      }

      setLoading(false);
    } catch {}
  }, []);

  const getPaymentTypes = useCallback(() => {
      const data = Object.values(ITypePayment).map((value: any, index: number) => {
        return {
          value: `${index + 1}`,
          label: value,
        };
      });
  
      setPaymentTypes(data);
    }, []);

  useEffect(() => {
    getPaymentTicket();
    getPaymentTypes();
  }, [getPaymentTicket, getPaymentTypes]);

  return (
    <Fragment>
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <Loading loading={loading} />
        <div className="overflow-y-scroll w-auto max-h-[650px] p-5">
          <div className="flex flex-col mb-2 mt-3">
            <span className="text-sm text-[#000] font-bold">
              Dados de pagamento
            </span>
          </div>
          <div className="w-full h-[2px] bg-[#0A4984]" />
          <div className="w-full h-full flex items-start mt-4">
            <div className="w-2/4 max-h-[550px] overflow-y-scroll">
              <div className="w-full h-full flex items-center">
                {Ticket(dataTicket)}
              </div>
            </div>
            <div className="w-[3px] h-[550px] bg-[#0A4984] ml-4" />
            <div className="">
              <div className="flex flex-col mb-2 ml-6">
                <span className="text-base text-[#000] font-bold">
                  Informações para pagamento
                </span>
              </div>
              <div className="w-full grid grid-cols-1 gap-3 mb-4 ml-6 mt-4">
                <div className="w-full">

                <SelectCustom
                  title="Tipo de pagamento"
                  data={paymentTypes}
                  onChange={(selectedOption: any) => {
                    
                    // formik.setFieldValue(
                      //   "id_transportadora",
                      //   selectedOption.value
                      // )
                    }
                  }
                  // touched={formik.touched.id_transportadora}
                  // error={formik.errors.id_transportadora}
                  // value={formik.values.id_transportadora}
                  // disabled={props.isView}
                  />
                  </div>
                  <div className="mt-4">
                    <InputCustom typeInput="mask" mask="" title="Descontos" onChange={() => {}} placeholder="0" />
                  </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl mt-4">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          // onClick={() => formik.handleSubmit()}
        >
          Avançar
        </button>
      </div>
    </Fragment>
  );
};

export default Payment;
