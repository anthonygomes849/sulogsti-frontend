import { motion } from "framer-motion";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Logo from "../../../../../../../assets/images/logo-sulog-rodape.svg";
import InputCustom from "../../../../../../../components/InputCustom";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import { formatDateTimeBR, renderCargoTypes, renderVehicleTypes } from "../../../../../../../helpers/format";
import api from "../../../../../../../services/api";
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
                <div className="w-full h-full bg-[#FFF] p-1">
                  <div
                    className="w-full h-full p-4 flex flex-col items-center justify-center"
                    style={{ border: "2px solid #000" }}
                  >
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <img src={Logo} width={140} height={140} />
                      <div className="w-full flex items-center justify-center mt-3">
                        <h1 className="text-sm text-[#000] font-bold mr-1">
                          CNPJ:
                        </h1>
                        <span className="text-sm text-[#000] font-bold">
                          11.166.491/0001-61
                        </span>
                      </div>
                    </div>

                    <div
                      className="w-full flex flex-col items-center justify-center mt-2 p-4"
                      style={{ borderBottom: "2px dashed #000" }}
                    >
                      <span className="text-sm text-[#000] font-bold">
                        Agendamento:
                      </span>
                      <span className="text-sm text-[#000] font-bold mt-1">
                        {dataTicket &&
                        dataTicket.operacaoPatio.operacao_porto_agendada !==
                          null
                          ? formatDateTimeBR(
                              dataTicket.operacaoPatio.operacao_porto_agendada
                                .data_agendamento_terminal
                            )
                          : "---"}
                      </span>
                    </div>
                    <div
                      className="w-full flex flex-col items-center justify-center p-4"
                      style={{ borderBottom: "2px dashed #000" }}
                    >
                      <span className="text-sm text-[#000] font-bold">
                        Motorista:
                      </span>
                      <span className="text-sm text-[#000] font-bold mt-1">
                        ---
                        {/* {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null ? dataTicket.operacaoPatio.operacao_porto_agendada.} */}
                      </span>
                    </div>
                    <div
                      className="w-full flex flex-col items-center justify-center mt-3 p-4"
                      style={{ borderBottom: "2px dashed #000" }}
                    >
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tipo do Veículo:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_patio_identificacao_veiculo && dataTicket.operacaoPatio.operacao_patio_identificacao_veiculo !== null ? renderVehicleTypes(dataTicket.operacaoPatio.operacao_patio_identificacao_veiculo.tipo_veiculo) : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Placa:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null ? dataTicket.operacaoPatio.operacao_porto_agendada.placa_dianteira_veiculo : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Transportadora:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null && dataTicket.operacaoPatio.operacao_porto_agendada.transportadora !== null ? dataTicket.operacaoPatio.operacao_porto_agendada.transportadora.razao_social : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Terminal:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null && dataTicket.operacaoPatio.operacao_porto_agendada.terminal !== null ? dataTicket.operacaoPatio.operacao_porto_agendada.terminal.razao_social : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tipo Carga:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null && dataTicket.operacaoPatio.operacao_porto_agendada.tipo_carga !== null ? renderCargoTypes(dataTicket.operacaoPatio.operacao_porto_agendada.tipo_carga).replace(',', '') : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Número Container:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.operacao_porto_agendada !== null && dataTicket.operacaoPatio.operacao_porto_agendada.identificadores_conteineres !== null ? dataTicket.operacaoPatio.operacao_porto_agendada.identificadores_conteineres : '---'}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-full flex flex-col items-center justify-center mt-3 p-4"
                      style={{ borderBottom: "2px dashed #000" }}
                    >
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Entrada:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.operacaoPatio.entrada_veiculo !== null ? formatDateTimeBR(dataTicket.operacaoPatio.entrada_veiculo.data_hora) : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Pagamento:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          ---
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tempo de Permanência:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.tempo_permanencia !== null ? dataTicket.tempo_permanencia : '---'}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Qtd. de Horas Extras:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.qtd_horas_extras !== null ? dataTicket.qtd_horas_extras : '---'}
                        </span>
                      </div>
                    </div>
                    <div
                      className="w-full flex flex-col items-center justify-center mt-3 p-4"
                      style={{ borderBottom: "2px dashed #000" }}
                    >
                      <div className="w-full flex items-center justify-between mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Triagem:
                        </span>
                        <div
                          className="w-full ml-2 mr-2"
                          style={{ border: "1px dashed #ccc" }}
                        />
                        <span className="text-sm text-[#000] font-bold ml-1 w-full">
                          R$ {Number(dataTicket?.valor_total_triagem).toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-between mb-4">
                        <span className="text-sm text-[#000] font-bold">
                          Estadia:
                        </span>
                        <div
                          className="w-full ml-2 mr-2"
                          style={{ border: "1px dashed #ccc" }}
                        />
                        <span className="text-sm text-[#000] font-bold ml-1 w-full">
                          R$ {Number(dataTicket?.valor_total_estadia).toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-between mb-1">
                        <span className="w-[70%] text-sm text-[#000] font-bold">
                          Valor Pago:
                        </span>
                        <div
                          className="w-full ml-2 mr-2"
                          style={{ border: "1px dashed #ccc" }}
                        />
                        <span className="text-sm text-[#000] font-bold ml-1 w-full">
                          R$ {Number(dataTicket?.valor_pago).toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full flex items-center justify-between mb-4">
                        <span className="w-[70%] text-sm text-[#000] font-bold">
                          Falta Pagar:
                        </span>
                        <div
                          className="w-full mr-2"
                          style={{ border: "1px dashed #ccc" }}
                        />
                        <span className="text-sm text-[#000] font-bold ml-1 w-full">
                          R$ {Number(dataTicket?.valor_a_pagar).toFixed(2)}
                        </span>
                      </div>

                      <div className="w-full flex flex-col items-center justify-between mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tipo de pagamento:
                        </span>
                        <span className="text-sm text-[#000] font-bold ml-1 flex flex-col">
                          DINHEIRO
                        </span>
                        <span className="text-sm text-[#000] font-bold ml-1 flex flex-col">
                          CRÉDITO
                        </span>
                      </div>
                    </div>

                    <div className="w-full flex flex-col items-center justify-center mt-3 p-4">
                      <div className="w-full flex items-center justify-between mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Operador:
                        </span>
                        <span className="text-sm text-[#000] font-bold ml-1 w-full">
                          ADMINISTRADOR
                        </span>
                      </div>

                      <div className="mt-6">
                        <span className="max-w-[50%] text-base text-wrap text-[#000] font-bold">
                          DOCUMENTO SEM VALOR FISCAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
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
                    <InputCustom title="Descontos" onChange={() => {}} placeholder="0" />
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
