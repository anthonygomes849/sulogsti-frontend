import React, { Fragment, useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import { motion } from "framer-motion";
import Logo from "../../../../../../../assets/images/logo-sulog-rodape.svg";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import api from "../../../../../../../services/api";
import { ITypePayment } from "./types/types";

// Interface for payment type API response
import './styles.css';
import { format } from "date-fns";
import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import { Label } from "reactstrap";
import {
  formatDateTimeBR,
  renderPaymentTypes,
} from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import { FrontendNotification } from "../../../../../../../shared/Notification";
import Ticket from "./Ticket";
import formValidator from "./validators/formValidator";
import InputCustom from "../../../../../../../components/InputCustom";

// Import the new separated Linx payment configuration
import {
  useLinxPayment,
  PaymentMethodType,
  type PaymentFormData,
  type PaymentTicketData,
  type PaymentTypeOption,
  type LinxPaymentResponse,
  type LinxPaymentError
} from "../../../../../../../services/payment/linx";

interface PaymentProps {
  onClose: () => void;
}

const Payment: React.FC<PaymentProps> = ({ onClose }) => {
  const [dataTicket, setDataTicket] = useState<PaymentTicketData | undefined>();
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypeOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [administrativeCode, setAdministrativeCode] = useState<string | null>(null);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const { setStatus } = useStatus();

  // Use the new Linx payment hook
  const linxPayment = useLinxPayment({
    autoInitialize: true,
    onPaymentSuccess: handleLinxPaymentSuccess,
    onPaymentError: handleLinxPaymentError,
  });

  /**
   * Handle successful Linx payment
   */
  function handleLinxPaymentSuccess(response: LinxPaymentResponse): void {
    console.log('Linx payment successful:', response);

    setAdministrativeCode(String(response.administrativeCode));
    // Process the form submission after successful payment
    setTimeout(() => {
      formik.handleSubmit();
    }, 1000);
  }

  /**
   * Handle Linx payment error
   */
  function handleLinxPaymentError(error: LinxPaymentError): void {
    console.error('Linx payment error:', error);
    // Error is already handled by the utility functions
  }

  const onHandleBack = useCallback(async () => {
    try {
      setLoading(true);

      let currentRow = sessionStorage.getItem("@triagem");
      let parsedRow: any = null;

      if (currentRow) {
        parsedRow = JSON.parse(currentRow);
      }

      const id_operacao_patio =
        sessionStorage.getItem("id_operacao_patio") ||
        parsedRow?.id_operacao_patio;

      const body = {
        id_operacao_patio
      };

      const response = await api.post('/operacaopatio/deleteIdVeiculoAutorizacao', body);

      if (response.status === 200) {
        setStatus(2);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, [setStatus]);

  const getSupervisorCpf = useCallback(async (cpfSupervisor: string) => {
    try {
      setLoading(true);

      const body = {
        cpf: cpfSupervisor
      };

      const response = await api.post('/operacaopatio/cpfSupervisor', body);

      setLoading(false);

      return response.data;

    } catch {
      setLoading(false);
      return null;
    }
  }, []);

  const getPaymentTicket = useCallback(async () => {
    try {
      setLoading(true);

      let currentRow = sessionStorage.getItem("@triagem");
      let parsedRow: any = null;

      if (currentRow) {
        parsedRow = JSON.parse(currentRow);
      }

      const id_operacao_patio =
        sessionStorage.getItem("id_operacao_patio") ||
        parsedRow?.id_operacao_patio;

      const body = {
        id_operacao_patio,
      };

      const response = await api.post('/operacaopatio/custoOperacao', body);

      if (response.status === 200) {
        setDataTicket(response.data);

        // Set the payment amount in formik
        const valorAPagar = response.data.valor_a_pagar || 0;
        formik.setFieldValue("valor_pago", valorAPagar.toString());
      }

      setLoading(false);
      return response.data;
    } catch {
      setLoading(false);
    }
  }, []);

  const getPaymentTypes = useCallback(async () => {
    try {
      setLoading(true);

      const formattedTypes = Object.values(ITypePayment).map((value: string, index: number) => ({
        value: `${index + 1}`,
        label: value,
        isDisabled: index <= 2,
        isHide: index <= 2,
      }));

      setPaymentTypes(formattedTypes);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onSavePorto = useCallback(async (data: any) => {
    try {
      setLoading(true);


      const body = {
        operacaoPatio: data.operacaoPatio,
      };

      await api.post('/operacaopatio/savePorto', body);


      setLoading(false);

      return;
    } catch {
      setLoading(false);
    }
  }, [])

  const handleSubmit = useCallback(
    async (values: PaymentFormData, dataTicket: PaymentTicketData | undefined, administrativeCode: string | null) => {
      try {
        setLoading(true);

        const cpfSupervisor = values.cpf_supervisor.replaceAll(".", "").replace("-", "");

        let getCpfSupervisor = null;

        if (values.desconto.length > 0 && Number(values.desconto) > 0) {
          getCpfSupervisor = await getSupervisorCpf(cpfSupervisor);
        }

        if (values.desconto.length > 0 && Number(values.desconto) > 0 && cpfSupervisor.length === 11 && !getCpfSupervisor) {
          FrontendNotification("CPF Supervisor inválido", "warning");
          setLoading(false);
          return;
        }

        let currentRow = sessionStorage.getItem("@triagem");
        let parsedRow: any = null;

        if (currentRow) {
          parsedRow = JSON.parse(currentRow);
        }

        const id_operacao_patio =
          sessionStorage.getItem("id_operacao_patio") ||
          parsedRow?.id_operacao_patio;

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");

        const valorPago = Number(values.valor_pago);
        const desconto = Number(values.desconto || 0);

        const body = {
          id_operacao_patio,
          tipo_pagamento: values.tipo_pagamento,
          desconto:
            values.desconto.length > 0
              ? parseFloat(values.desconto).toFixed(2)
              : 0.0,
          quantia_paga: Number(valorPago - desconto).toFixed(2),
          valor_total: valorPago.toFixed(2),
          data_hora_pagamento: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          tempo_base_triagem:
            dataTicket && dataTicket.comercialCustoTriagem
              ? dataTicket.comercialCustoTriagem.tempo_base_triagem
              : null,
          custo_base_triagem:
            dataTicket && dataTicket.comercialCustoTriagem
              ? dataTicket.comercialCustoTriagem.custo_base_triagem
              : null,
          custo_hora_extra:
            dataTicket && dataTicket.comercialCustoEstadia
              ? dataTicket.comercialCustoEstadia.custo_hora
              : null,
          custo_meia_diaria:
            dataTicket && dataTicket.comercialCustoEstadia
              ? dataTicket.comercialCustoEstadia.custo_meia_diaria
              : null,
          custo_diaria:
            dataTicket && dataTicket.comercialCustoEstadia
              ? dataTicket.comercialCustoEstadia.custo_diaria
              : null,
          id_usuario_historico: userId,
          status: 11,
          administrative_code: administrativeCode !== null ? administrativeCode : null,
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

          setAdministrativeCode(null);

          setShowTicket(false);
          setShowTicket(true);
          onSavePorto(dataTicket);
          setTimeout(() => {
            onClose();
          }, 3000);


        }

        setLoading(false);
      } catch (error) {
        console.error('Payment submission error:', error);
        FrontendNotification("Erro ao processar pagamento", "error");
        setLoading(false);
      }
    },
    [getSupervisorCpf, getPaymentTicket, setStatus]
  );

  const onPayment = useCallback(async (values: PaymentFormData) => {
    try {
      const paymentMethod = values.tipo_pagamento;
      const amount = parseFloat(values.valor_pago) - parseFloat(values.desconto || "0");

      // Check if this payment method requires Linx SDK
      if (paymentMethod === PaymentMethodType.CREDIT_CARD ||
        paymentMethod === PaymentMethodType.DEBIT_CARD) {

        // Use the new Linx payment integration
        await linxPayment.processPayment(paymentMethod, amount);
      } else {
        setAdministrativeCode(null);
        // For non-card payments, submit directly
        formik.handleSubmit();
      }
    } catch (error) {
      console.error('Payment processing error:', error);
    }
  }, [linxPayment]);

  const cancelPayments = useCallback(async () => {
    await linxPayment.cancelPayment();
  }, [])

  const initialValues: PaymentFormData = {
    tipo_pagamento: "",
    desconto: "",
    valor_pago: "",
    cpf_supervisor: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values) => handleSubmit(values, dataTicket, administrativeCode),
  });

  useEffect(() => {
    getPaymentTicket();
    getPaymentTypes();
    cancelPayments();
  }, [getPaymentTicket, getPaymentTypes, cancelPayments]);

  return (
    <Fragment>
      <Loading loading={loading} />
      <ToastContainer />
      {showTicket && (
        <div className="hidden">
          <Ticket numPages={1} data={dataTicket} onClose={() => { }} />
        </div>
      )}
      {linxPayment.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">Erro no sistema de pagamento: {linxPayment.error}</span>
          <button
            onClick={linxPayment.resetError}
            className="float-right font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
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
                      <img src={Logo} width={140} height={140} alt="SULOG Logo" />
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
                          dataTicket.operacaoPatio.operacao_porto_agendada
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
                        {dataTicket && dataTicket.motorista
                          ? dataTicket.motorista.nome
                          : "---"}
                      </span>
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
                      {dataTicket && dataTicket.valor_hora_extra > 0 && (
                        <div className="w-full flex items-center justify-between mb-4">
                          <span className="text-sm text-[#000] font-bold">
                            Hora Extra:
                          </span>
                          <div
                            className="w-full ml-2 mr-2"
                            style={{ border: "1px dashed #ccc" }}
                          />
                          <span className="text-sm text-[#000] font-bold ml-1 w-full">
                            {dataTicket?.valor_hora_extra.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                      )}
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
                              (item, index) => (
                                <span key={index} className="text-sm text-[#000] font-bold ml-1 flex flex-col">
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
                    onChange={(selectedOption) => {
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
                    onValueChange={(values) => {
                      formik.setFieldValue("valor_pago", values.value);
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
                    onValueChange={(values) => {
                      formik.setFieldValue("desconto", values.value);
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
                {formik.values.desconto.length > 0 && Number(formik.values.desconto) > 0 && (
                  <div className="">
                    <InputCustom
                      title="CPF do supervisor"
                      typeInput="mask"
                      mask="999.999.999-99"
                      placeholder=""
                      onChange={formik.handleChange("cpf_supervisor")}
                      touched={formik.touched.cpf_supervisor}
                      error={formik.errors.cpf_supervisor}
                      value={formik.values.cpf_supervisor}
                    />
                  </div>
                )}
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
          onClick={() => onPayment(formik.values)}
          disabled={loading}
        >
          Finalizar
        </button>
      </div>
    </Fragment>
  );
};

export default Payment;