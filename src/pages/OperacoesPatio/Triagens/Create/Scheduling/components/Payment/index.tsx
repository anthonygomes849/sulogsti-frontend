import { motion } from "framer-motion";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import Logo from "../../../../../../../assets/images/logo-sulog-rodape.svg";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import api from "../../../../../../../services/api";
import { IPaymentTicket, ITypePayment } from "./types/types";

import { format } from "date-fns";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { Label } from "reactstrap";
import {
  formatDateTimeBR,
  renderCargoTypes,
  renderPaymentTypes,
  renderVehicleTypes,
} from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import { FrontendNotification } from "../../../../../../../shared/Notification";
import Ticket from "./Ticket";
import formValidator from "./validators/formValidator";

interface FormValues {
  tipo_pagamento: string;
  valor_pago: string;
  desconto: string;
}
// import { Container } from './styles';

declare global {
  interface Window {
    PaykitCheckout: {
      authenticate: (
        authRequest: any,
        success: (response: any) => void,
        error: (error: any) => void,
        handlePendingPayments: (pendingPayment: any) => void
      ) => void;
    };
  }
}

interface Props {
  onClose: () => void;
}

const Payment: React.FC<Props> = (props: Props) => {
  const [dataTicket, setDataTicket] = useState<IPaymentTicket>();
  const [paymentTypes, setPaymentTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showTicket, setShowTicket] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const { setStatus } = useStatus();

  const onHandleBack = useCallback(async () => {
    try {
      setLoading(true);

      let currentRow: any = sessionStorage.getItem("@triagem");

      if (currentRow) {
        currentRow = JSON.parse(currentRow);
      }

      const id_operacao_patio =
        sessionStorage.getItem("id_operacao_patio") ||
        currentRow.id_operacao_patio;

      const body = {
        id_operacao_patio
      };

      const response = await api.post('/operacaopatio/deleteIdVeiculoAutorizacao', body);

      if(response.status === 200) {
        setStatus(2);
      }

      setLoading(false);
    }catch{
      setLoading(false);
    }
  }, [])

  const handleSubmit = useCallback(
    async (values: FormValues, dataTicket?: IPaymentTicket) => {
      try {
        setLoading(true);

        let currentRow: any = sessionStorage.getItem("@triagem");

        if (currentRow) {
          currentRow = JSON.parse(currentRow);
        }

        const id_operacao_patio =
          sessionStorage.getItem("id_operacao_patio") ||
          currentRow.id_operacao_patio;

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        // const valorFinal = Number(values.valor_pago) + Number(values.desconto);

        // const paymentFinished =
        //   Number(dataTicket?.valor_a_pagar) > Number(valorFinal);
        const valorPago: any = Number(values.valor_pago).toFixed(2);
        const desconto: any = Number(values.desconto).toFixed(2);

        const body = {
          id_operacao_patio,
          tipo_pagamento: values.tipo_pagamento,
          desconto:
            values.desconto.length > 0
              ? parseFloat(values.desconto).toFixed(2)
              : 0.0,
          quantia_paga: values.valor_pago,
          valor_total: Number(valorPago - desconto).toFixed(2), //Desconto
          data_hora_pagamento: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          tempo_base_triagem:
            dataTicket && dataTicket.comercialCustoTriagem !== null
              ? dataTicket?.comercialCustoTriagem.tempo_base_triagem
              : null,
          custo_base_triagem:
            dataTicket && dataTicket.comercialCustoTriagem !== null
              ? dataTicket.comercialCustoTriagem.custo_base_triagem
              : null,
          custo_hora_extra:
            dataTicket && dataTicket.comercialCustoEstadia !== null
              ? dataTicket.comercialCustoEstadia.custo_hora
              : null,
          custo_meia_diaria:
            dataTicket && dataTicket.comercialCustoEstadia !== null
              ? dataTicket.comercialCustoEstadia.custo_meia_diaria
              : null,
          custo_diaria:
            dataTicket && dataTicket.comercialCustoEstadia !== null
              ? dataTicket.comercialCustoEstadia.custo_diaria
              : null,
          id_usuario_historico: userId,
          status: 11,
        };

        const response = await api.post(
          "/operacaopatio/adicionarPagamento",
          body,
          {
            headers: {
              Host: "https://api2.sulog.com.br",
            },
          }
        );

        if (response.status === 200) {
          FrontendNotification("Pagamento realizado com sucesso!", "success");
          setShowTicket(false);
          setShowTicket(true);
          setTimeout(() => {
            props.onClose();
          }, 3000);
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
    []
  );

  const getPaymentTicket = useCallback(async () => {
    try {
      setLoading(true);

      let getDataTriagem: any = sessionStorage.getItem("@triagem");
      if (getDataTriagem) {
        getDataTriagem = JSON.parse(getDataTriagem);
      }
      const idOperacaoPatio = sessionStorage.getItem('id_operacao_patio');

      const id = idOperacaoPatio && idOperacaoPatio.length > 0 ? idOperacaoPatio : getDataTriagem?.id_operacao_patio

      const body = {
        id_operacao_patio: id,
      };

      const response = await api.post("/operacaopatio/custoOperacao", body);

      if (response.status === 200) {
        setDataTicket(response.data);

        formik.setFieldValue("valor_pago", response.data.valor_a_pagar);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getPaymentTypes = useCallback(() => {
    const data = Object.values(ITypePayment).map(
      (value: any, index: number) => {
        return {
          value: `${index + 1}`,
          label: value,
          isDisabled: index <= 4,
          isHide: index <= 2,
        };
      }
    );

    const filteredData = data.filter((item: any) => !item.isHide);

    console.log(filteredData);

    setPaymentTypes(filteredData);
  }, []);

  // if (window.PaykitCheckout) {
  //   const authenticationRequest = {
  //     authenticationKey: '11166491000161'
  //   };

  //   // Success handler
  //   const success = (response: any) => {
  //     console.log('Payment successful!', response);
  //   };

  //   // Error handler
  //   const error = (error: any) => {
  //     console.error('Payment failed', error);
  //   };

  //   // Pending payments handler
  //   const handlePendingPayments = (pendingPayment: any) => {
  //     console.log('Handling pending payment:', pendingPayment);
  //   };

  //   // Triggering the PaykitCheckout.authenticate method
  //   window.PaykitCheckout.authenticate(
  //     authenticationRequest,
  //     success,
  //     error,
  //     handlePendingPayments
  //   );
  // }

  const initialValues: FormValues = {
    tipo_pagamento: "",
    desconto: "",
    valor_pago: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, dataTicket),
  });

  useEffect(() => {
    getPaymentTicket();
    getPaymentTypes();
  }, [getPaymentTicket, getPaymentTypes]);

  return (
    <Fragment>
      <Loading loading={loading} />
      <ToastContainer />
      {showTicket && (
        <div className="hidden">
          <Ticket numPages={1} data={dataTicket} onClose={() => {}} />
        </div>
      )}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <div className="overflow-y-scroll w-auto max-h-[calc(70vh)] p-5">
          <div className="flex flex-col mb-2 mt-3">
            <span className="text-sm text-[#000] font-bold">
              Dados de pagamento
            </span>
          </div>
          <div className="w-full h-[2px] bg-[#0A4984]" />
          <div className="w-full h-full flex items-start mt-4">
            <div className="w-2/4 max-h-[550px] overflow-y-scroll">
              <div className="w-full h-full flex items-center">
                <div className="w-full h-full bg-[#FFF] p-1" id="ticket">
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
                        {dataTicket && dataTicket.motorista !== null
                          ? dataTicket.motorista.nome
                          : "---"}
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
                          {dataTicket &&
                          dataTicket.operacaoPatio
                            .operacao_patio_identificacao_veiculo &&
                          dataTicket.operacaoPatio
                            .operacao_patio_identificacao_veiculo !== null
                            ? renderVehicleTypes(
                                dataTicket.operacaoPatio
                                  .operacao_patio_identificacao_veiculo
                                  .tipo_veiculo
                              )
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Placa:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.veiculo !== null
                            ? dataTicket.veiculo.placa
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Transportadora:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket &&
                          dataTicket.operacaoPatio.operacao_porto_agendada !==
                            null &&
                          dataTicket.operacaoPatio.operacao_porto_agendada
                            .transportadora !== null
                            ? dataTicket.operacaoPatio.operacao_porto_agendada
                                .transportadora.razao_social
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Terminal:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket &&
                          dataTicket.operacaoPatio.operacao_porto_agendada !==
                            null &&
                          dataTicket.operacaoPatio.operacao_porto_agendada
                            .terminal !== null
                            ? dataTicket.operacaoPatio.operacao_porto_agendada
                                .terminal.razao_social
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tipo Carga:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket &&
                          dataTicket.operacaoPatio.operacao_porto_agendada !==
                            null &&
                          dataTicket.operacaoPatio.operacao_porto_agendada
                            .tipo_carga !== null
                            ? renderCargoTypes(
                                dataTicket.operacaoPatio.operacao_porto_agendada
                                  .tipo_carga
                              ).replace(",", "")
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Número Container:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket &&
                          dataTicket.operacaoPatio.operacao_porto_agendada !==
                            null &&
                          dataTicket.operacaoPatio.operacao_porto_agendada
                            .identificadores_conteineres !== null
                            ? dataTicket.operacaoPatio.operacao_porto_agendada
                                .identificadores_conteineres
                            : "---"}
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
                          {dataTicket &&
                          dataTicket.operacaoPatio.entrada_veiculo !== null
                            ? formatDateTimeBR(
                                dataTicket.operacaoPatio.entrada_veiculo
                                  .data_hora
                              )
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Pagamento:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                        {dataTicket?.operacaoPatio &&
                    dataTicket?.operacaoPatio.pagamento &&
                    dataTicket?.operacaoPatio.pagamento.length > 0
                      ? dataTicket?.operacaoPatio.pagamento
                          .map((item: any) =>
                            formatDateTimeBR(item.data_hora_pagamento)
                          )
                          .join(",")
                      : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tempo de Permanência:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.tempo_permanencia !== null
                            ? dataTicket.tempo_permanencia
                            : "---"}
                        </span>
                      </div>
                      <div className="w-full flex items-center mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Qtd. de Horas Extras:
                        </span>
                        <span className="text-sm text-[#000] font-normal ml-1">
                          {dataTicket && dataTicket.qtd_horas_extras !== null
                            ? dataTicket.qtd_horas_extras
                            : "---"}
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
                          {dataTicket?.valor_total_triagem.toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
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
                          {dataTicket?.valor_total_estadia.toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            }
                          )}
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
                          {dataTicket?.valor_pago.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
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
                          {dataTicket?.valor_a_pagar
                            ? dataTicket?.valor_a_pagar.toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                }
                              )
                            : `R$ 0.00`}
                        </span>
                      </div>

                      <div className="w-full flex flex-col items-center justify-between mb-1">
                        <span className="text-sm text-[#000] font-bold">
                          Tipo de pagamento:
                        </span>
                        {dataTicket?.operacaoPatio &&
                        dataTicket?.operacaoPatio.pagamento &&
                        dataTicket?.operacaoPatio.pagamento.length > 0 ? (
                          <>
                            {dataTicket?.operacaoPatio.pagamento.map(
                              (item: any) => (
                                <span className="text-sm text-[#000] font-bold ml-1 flex flex-col">
                                  {renderPaymentTypes(item.tipo_pagamento)}
                                </span>
                              )
                            )}
                          </>
                        ) : (
                          "---"
                        )}
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
            <div className="w-2/4 mr-6">
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
                      formik.setFieldValue(
                        "tipo_pagamento",
                        selectedOption.value
                      );
                    }}
                    touched={formik.touched.tipo_pagamento}
                    error={formik.errors.tipo_pagamento}
                    value={formik.values.tipo_pagamento}
                  />
                </div>
                <div className="mt-4">
                  <Label className="text-sm text-[#000] font-semibold mb-2">
                    Valor a Pagar
                  </Label>
                  <NumericFormat
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    fixedDecimalScale
                    disabled
                    prefix="R$"
                    placeholder="R$ 0,00"
                    onValueChange={(values: any) => {
                      formik.setFieldValue("valor_pago", values.value); // Unformatted numeric value
                    }}
                    value={formik.values.valor_pago}
                    className="h-[38px]"
                  />
                  {formik.touched.valor_pago && formik.errors.valor_pago && (
                    <span className="text-sm text-[#EA004C] font-bold">
                      {formik.errors.valor_pago}
                    </span>
                  )}
                </div>
                <div className="">
                  <Label className="text-sm text-[#000] font-semibold mb-2">
                    Descontos
                  </Label>
                  <NumericFormat
                    thousandSeparator=","
                    decimalSeparator="."
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="R$"
                    placeholder="R$ 0,00"
                    onValueChange={(values: any) => {
                      formik.setFieldValue("desconto", values.value); // Unformatted numeric value
                    }}
                    value={formik.values.desconto}
                    className="h-[38px]"
                  />
                  {formik.touched.desconto && formik.errors.desconto && (
                    <span className="text-sm text-[#EA004C] font-bold">
                      {formik.errors.desconto}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="sticky bottom-0 w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl mt-4">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#F9FAFA] text-sm text-[#000] font-bold rounded-full mr-2 shadow-md"
          onClick={() => onHandleBack()}
          style={{ border: '1px solid #DBDEDF' }}
        >
          Voltar
        </button>
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2 shadow-md"
          onClick={() => formik.handleSubmit()}
        >
          Finalizar
        </button>
      </div>
    </Fragment>
  );
};

export default Payment;
