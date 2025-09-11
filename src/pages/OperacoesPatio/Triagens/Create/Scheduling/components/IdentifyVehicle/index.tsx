import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import {
  IVeiculos,
  TipoVeiculo,
} from "../../../../../../Cadastro/Veiculos/types/types";
// import Checkbox from "./components/Checkbox";
import { format } from "date-fns";
import { ToastContainer } from "react-toastify";
import Checkbox from "../../../../../../../components/Checkbox";
import { FrontendNotification } from "../../../../../../../shared/Notification";
import CreateVeiculos from "../../../../../../Cadastro/Veiculos/components/Create";
import { ITriagens } from "../../../../types/types";
import formValidator from "./validators/formValidator";
import formValidator2 from "./validators/formValidator2";
import * as Yup from 'yup';
import ModalConfirm from "../../../../../../../components/ModalConfirm";


// import { Container } from './styles';

interface FormValues {
  id_veiculo_parte_motorizada: string;
  id_veiculo_parte_nao_motorizada: string;
  license_plate_motorized: string;
  license_plate: string;
  id_transportadora: string;
  cnpj_transportadora: string;
  tipo_placa: number;
  tipo_veiculo: string;
  identificacao_carga: boolean;
}

const IdentifyVehicle: React.FC = () => {
  const [listVehicle, setListVehicle] = useState<any[]>([]);
  const [detailVehicleMotorized, setDetailVehicleMotorized] = useState<
    IVeiculos[]
  >([]);
  const [detailVehicle, setDetailVehicle] = useState<IVeiculos[]>([]);
  const [transportadoras, setTransportadoras] = useState<any[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCreateVehicle, setShowCreateVehicle] = useState<boolean>(false);
  const [rowData, setRowData] = useState<ITriagens>();
  const [showBackPlateModal, setShowBackPlateModal] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const vehicleVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const detailVehicleVariants = {
    initial: { opacity: 0, y: 100 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.5 } },
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

      const response = await api.post('/operacaopatio/deleteIdMotorista', body);

      if (response.status === 200) {
        setStatus(1);
      }

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
  }, []);

  const onPaymentInvoiced = useCallback(async (values: FormValues, data: any[], isInvoiced: boolean) => {
    try {
      setLoading(true);

      console.log("Entrou");

      let currentRow: any = sessionStorage.getItem("@triagem");

      if (currentRow) {
        currentRow = JSON.parse(currentRow);
      }

      const id_operacao_patio =
        sessionStorage.getItem("id_operacao_patio") ||
        currentRow.id_operacao_patio;

      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      console.log("Payment Entrou");

      const dataTicket = await getPaymentTicket();

      console.log("Data Ticket ", dataTicket);

      const body = {
        id_operacao_patio,
        tipo_pagamento: isInvoiced ? 3 : 9,
        desconto: 0.0,
        quantia_paga: dataTicket?.valor_a_pagar,
        valor_total: dataTicket?.valor_a_pagar, //Desconto
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

      console.log("Payment Body", body);

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
        FrontendNotification("Triagem faturada com sucesso!", "success");

        const custoOperacao = await getPaymentTicket();

        if (custoOperacao && custoOperacao !== null) {
          onSavePorto(custoOperacao);
        }
        const findCarrierById = data.find(
          (item: any) =>
            String(item.id_transportadora) == String(values.id_transportadora)
        );

        console.log(findCarrierById)

        if(isInvoiced) {

          
          if (
            findCarrierById &&
            (findCarrierById.faturamento_triagem || findCarrierById.faturamento_estadia)
          ) {
            setStatus(4);
          } else {
            setStatus(3);
          }
        } else {
          setStatus(4);
        }
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onUpdateAutorizacao = useCallback(
    async (
      values: FormValues,
      idOperacaoPatio: string | number,
      idUser: string | null,
      data: any[]
    ) => {
      try {
        setLoading(true);

        console.log("Entrou autorizacao");

        const isInvoiced: boolean = isInvoicedCarrier(values, data);

        console.log("isInvoiced", isInvoiced);

        let currentRow: any = sessionStorage.getItem("@triagem");
        if (currentRow) {
          currentRow = JSON.parse(currentRow);
        }

        console.log("currentRow", currentRow);

        const body = {
          id_operacao_patio: idOperacaoPatio,
          identificacao_carga: values.identificacao_carga,
          cnpj_transportadora:
            values.cnpj_transportadora !== null
              ? values.cnpj_transportadora
              : null,
          autorizacao_faturar:
            values.cnpj_transportadora !== null ? true : false,
          status: 10,
          id_usuario_historico: idUser,
        };

        console.log("body", body);

        const response = await api.post(
          "/operacaopatio/adicionarAutorizacao",
          body
        );

        let isDevolucaoContainerVazio = false;

        if (currentRow.operacao_porto_agendada !== null) {
          isDevolucaoContainerVazio = currentRow.operacao_porto_agendada.tipo_carga === 3 && currentRow.operacao_porto_agendada.tipo_operacao === 2;
        }

        console.log("isDevolucaoContainerVazio", isDevolucaoContainerVazio);
        if (response.status === 200) {
          const custoOperacao = await getPaymentTicket();
          if (custoOperacao && custoOperacao.valor_a_pagar > 0) {
            if (isDevolucaoContainerVazio && !values.identificacao_carga) {
              console.log("isContainerVazio");
              if (custoOperacao && custoOperacao.valor_a_pagar > 0 && isInvoiced) {
                console.log("isContainerVazio faturado vazio");
                await onPaymentInvoiced(values, data, true);
              } else {
                const isAvulso = values.id_transportadora === "-1";
                if (isAvulso) {
                  console.log("isContainerVazio avulso");
                  setStatus(3);
                } else {
                  console.log("isContainerVazio faturado");
                  const findCarrierById = data.find((item: any) => String(item.id_transportadora) == String(values.id_transportadora));

                  if (findCarrierById && findCarrierById.faturamento_triagem || findCarrierById.faturamento_estadia) {
                    console.log("isContainerVazio faturado faturado");
                    await onPaymentInvoiced(values, data, true);
                  } else {
                    console.log("isContainerVazio payment");
                    setStatus(3);
                  }
                }
              }
            } else if (!isDevolucaoContainerVazio && values.identificacao_carga) {
              if (values.identificacao_carga && custoOperacao && custoOperacao !== null && custoOperacao.valor_a_pagar <= 0) {
                console.log("isContainerCheio faturado");
                setStatus(4);
              } else {
                if (isInvoiced) {
                  console.log("isContainerCheio faturado payment");
                  onPaymentInvoiced(values, data, true);
                } else {
                  console.log("isContainerCheio payment");
                  setStatus(3);
                }
              }
            } else {
              if (isInvoiced) {
                onPaymentInvoiced(values, data, true);
              } else {
                setStatus(3);
              }
            }

          } else {
            onPaymentInvoiced(values, data, false);
          }



        } else {
          FrontendNotification("Erro na identificação do veiculo!", "error");
        }

        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification("Erro na identificação do veiculo!", "error");
      }
    },
    []
  );

  const onSubmit = useCallback(async (values: FormValues, data: any[]) => {
    try {
      setLoading(true);

      let currentRow: any = sessionStorage.getItem("@triagem");

      if (currentRow) {
        currentRow = JSON.parse(currentRow);
      }

      const urlParams = new URLSearchParams(window.location.search);

      const userId = urlParams.get("userId");

      const idOperacaoPatio = sessionStorage.getItem("id_operacao_patio");

      const id =
        idOperacaoPatio && idOperacaoPatio.length > 0
          ? idOperacaoPatio
          : currentRow.id_operacao_patio;

      const body = {
        id_operacao_patio: id,
        id_veiculo_parte_motorizada:
          values.id_veiculo_parte_motorizada.length > 0
            ? Number(values.id_veiculo_parte_motorizada)
            : null,
        id_veiculo_parte_nao_motorizada:
          values.id_veiculo_parte_nao_motorizada.length > 0
            ? Number(values.id_veiculo_parte_nao_motorizada)
            : null,
        tipo_veiculo: values.tipo_veiculo,
        data_hora_identificacao: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        id_usuario_historico: userId,
        status: 5,
      };

      const response = await api.post(
        "/operacaopatio/confirmVehicleIdentity",
        body
      );

      console.log("response", response.status);

      if (response.status == 200) {
        sessionStorage.setItem("id_operacao_patio", response.data);
        onUpdateAutorizacao(values, id, userId, data);
      } else {
        console.log("entrou2")
        FrontendNotification(
          "Erro ao realizar a identificação do veiculo!",
          "error"
        );
      }

      setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      console.log(error);
      setLoading(false);
      FrontendNotification(
        "Erro ao realizar a identificação do veiculo!",
        "error"
      );
    }
  }, []);

  const onSearchVehicle = useCallback(async (value: string) => {
    try {
      setLoading(true);

      if (value.length > 0) {
        const body = {
          order_by: "data_historico",
          order_direction: "desc",
          qtd_por_pagina: 100,
          liscense_plate: value,
          placa: value,
        };

        const response = await api.post("/listar/veiculos", body);

        const mappingResponse = response.data.data.map((item: IVeiculos) => {
          return {
            label: `${item.placa}`,
            // liscense_plate: maskedPlate(item.placa),
            value: item.id_veiculo,
          };
        });

        setListVehicle(mappingResponse);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onSearchDetailVehicle = useCallback(async (values: FormValues, licensePlate?: string) => {
    try {
      setLoading(true);

      const body = {
        license_plate: values.license_plate.length > 0 ? values.license_plate : licensePlate,
        tipo_placa: 2,
      };

      const response = await api.post(
        "/operacaopatio/searchPlateVehicle",
        body
      );

      if (response.status === 200) {
        if (response.data.id_veiculo) {

          let data = [];

          data.push(response.data);

          setDetailVehicle(data);

          if (licensePlate) {
            formik.setFieldValue(
              "id_veiculo_parte_nao_motorizada",
              String(response.data.id_veiculo)
            );
          }
        }
      }

      setLoading(false);
    } catch {
      setLoading(false);
      FrontendNotification(
        "Não foi possivel encontrar o veículo com a placa informada",
        "warning"
      );
    }
  }, []);

  const onSearchDetailVehicleMotorized = useCallback(
    async (values: FormValues, licensePlate?: string) => {
      try {
        setLoading(true);


        const body = {
          license_plate: values.license_plate_motorized.length > 0 ? values.license_plate_motorized : licensePlate,
          tipo_placa: values.tipo_placa,
        };

        const response = await api.post(
          "/operacaopatio/searchPlateVehicle",
          body
        );

        console.log(response.data);

        if (response.status === 200) {

          if (response.data.id_veiculo) {

            let data = [];

            data.push(response.data);

            setDetailVehicleMotorized(data);
            // if(response.data.tipo_veiculo == TipoVeiculo.TRUCK) {
            //   formik.setFieldValue('tipo_veiculo', "1");
            // } else if(response.data.tipo_veiculo == TipoVeiculo.CARRETA) {
            //   formik.setFieldValue('tipo_veiculo', "2");
            // } else {
            //   formik.setFieldValue('tipo_veiculo', "3");
            // }

            if (licensePlate) {
              formik.setFieldValue(
                "id_veiculo_parte_motorizada",
                String(response.data.id_veiculo)
              );
            }
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification(
          "Não foi possivel encontrar o veículo com a placa informada",
          "warning"
        );
      }
    },
    []
  );

  const getTransportadoras = useCallback(async () => {
    try {
      setLoading(true);

      let currentRow: any = sessionStorage.getItem("@triagem");

      if (currentRow) {
        currentRow = JSON.parse(currentRow);
      }

      const body = {
        qtd_por_pagina: 400,
        order_by: "data_historico",
        order_direction: "desc",
        id_operacao_porto_carrossel: currentRow?.operacao_porto_carrossel?.id_operacao_porto_carrossel
      };

      const url = currentRow && currentRow.operacao_porto_carrossel !== null ? '/listar/operacaoPortoCarrosselTransportadoras' : '/listar/transportadoras'

      const response = await api.post(url, body);

      if (response.status === 200) {
        let mappingResponse = response.data.data.map((item: any) => {
          return {
            label: item.razao_social,
            value: item.id_transportadora,
            cnpj: item.cnpj,
            ...item,
          };
        });

        mappingResponse.unshift({
          label: "Avulso",
          value: "-1",
          cnpj: null,
        });

        setTransportadoras(mappingResponse);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);


  const getVehicleTypes = useCallback(() => {
    let data = Object.values(TipoVeiculo).map((value: any, index: number) => {
      return {
        value: `${index + 1}`,
        label: value,
      };
    });

    data.unshift({
      label: "Selecione uma opção",
      value: ""
    });

    setVehicleTypes(data);

    let currentRow: any = sessionStorage.getItem("@triagem");

    if (currentRow) {
      currentRow = JSON.parse(currentRow);
    }

    setRowData(currentRow);
  }, []);

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
        return response.data;
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const isInvoicedCarrier = (values: FormValues, data: any[]) => {
    const findCarrierById = data.find(
      (item: any) =>
        String(item.id_transportadora) == String(values.id_transportadora)
    );

    console.log(findCarrierById);

    let result = false;

    if (findCarrierById) {
      if (findCarrierById.faturamento_triagem ||
        findCarrierById.faturamento_estadia) {
        result = true;
      }
    }

    console.log("result", result);

    return result;

  };

  const checkIfVehicleIsBackPlate = (values: FormValues) => {
    let getDataTriagem: any = sessionStorage.getItem("@triagem");
    if (getDataTriagem) {
      getDataTriagem = JSON.parse(getDataTriagem);
    }

    if (values.tipo_veiculo == '1' && getDataTriagem.entrada_veiculos.placa_dianteira !== null && getDataTriagem.entrada_veiculos.placa_dianteira.length > 0 && getDataTriagem.entrada_veiculos.placa_traseira !== null) {
      if (getDataTriagem.entrada_veiculos.placa_dianteira !== getDataTriagem.entrada_veiculos.placa_traseira) {
        return true;
      }
      return false;
    }

    return false;
  }

  const handleSubmit = useCallback((values: FormValues, data: any[]) => {

    const result = checkIfVehicleIsBackPlate(values);

    if (result) {
      setShowBackPlateModal(true);
    } else {
      onSubmit(values, data);
    }

  }, []);

  const onLoadFormValues = useCallback(() => {
    let getDataTriagem: any = sessionStorage.getItem("@triagem");
    if (getDataTriagem) {
      getDataTriagem = JSON.parse(getDataTriagem);
    }

    if (getDataTriagem && getDataTriagem.entrada_veiculos !== null) {
      if (getDataTriagem.entrada_veiculos.placa_dianteira !== null && getDataTriagem.entrada_veiculos.placa_dianteira.length > 0) {

        formik.setFieldValue(
          "license_plate_motorized",
          getDataTriagem.entrada_veiculos.placa_dianteira
        );

        onSearchDetailVehicleMotorized(formik.values, getDataTriagem.entrada_veiculos.placa_dianteira);
      }

      if (getDataTriagem.entrada_veiculos.placa_traseira !== null && getDataTriagem.entrada_veiculos.placa_traseira.length > 0) {

        formik.setFieldValue(
          "license_plate",
          getDataTriagem.entrada_veiculos.placa_traseira
        );
        onSearchDetailVehicle(formik.values, getDataTriagem.entrada_veiculos.placa_traseira);
      }

    }
  }, []);

  const initialValues: FormValues = {
    id_veiculo_parte_motorizada: "",
    id_veiculo_parte_nao_motorizada: "",
    license_plate_motorized: "",
    license_plate: "",
    id_transportadora: "",
    cnpj_transportadora: "",
    tipo_placa: 1,
    tipo_veiculo: "",
    identificacao_carga: false,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.lazy((values: FormValues) =>
      Number(values.tipo_veiculo) > 1 ? formValidator2 : formValidator
    ),
    onSubmit: (values: FormValues) => {
      console.log("values", values);
      console.log(values.tipo_veiculo);
      handleSubmit(values, transportadoras);
    },
  });




  useEffect(() => {
    getTransportadoras();
    getVehicleTypes();
  }, [getVehicleTypes]);

  useEffect(() => {
    onLoadFormValues();
  }, [onLoadFormValues])

  return (
    <>
      <Loading loading={loading} />
      {showCreateVehicle && (
        <CreateVeiculos
          isView={false}
          isEdit={false}
          onClear={() => {
            setShowCreateVehicle(!showCreateVehicle);
          }}
          onConfirm={() => {
            setShowCreateVehicle(!showCreateVehicle);
          }}
        />
      )}
      {showBackPlateModal && (
        <ModalConfirm
          isOpen={showBackPlateModal}
          title="Confirmar"
          message="A placa traseira e a placa dianteira da entrada são diferentes. Deseja continuar?"
          onConfirm={() => {
            setShowBackPlateModal(false);
            onSubmit(formik.values, transportadoras);
          }}
          onCancel={() => {
            setShowBackPlateModal(false);
          }}
        />
      )}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <ToastContainer />
        <div className="overflow-y-scroll max-h-[calc(80vh)] p-5 mb-10">
          <div className="flex mb-3 mt-3">
            <div className="flex flex-col">
              <span className="text-sm text-[#000] font-bold">
                Identificação da placa
              </span>
              <span className="text-sm text-[#666666] font-normal mt-3">
                Procura do cadastro do veículo
              </span>
            </div>
            <button
              type="button"
              className="w-28 h-9 ml-4 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
              onClick={() => setShowCreateVehicle(!showCreateVehicle)}
            >
              + Adicionar
            </button>
          </div>
          <div className="w-full h-full flex">
            <div className="w-[50%] h-full flex">
              <div className="w-full h-full flex flex-col">
                <div className="w-full flex">
                  <div className="flex flex-col w-full">
                    <SelectCustom
                      data={listVehicle}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue(
                          "id_veiculo_parte_motorizada",
                          String(selectedOption.value)
                        );
                        formik.setFieldValue(
                          "license_plate_motorized",
                          selectedOption.label
                        );
                      }}
                      onInputChange={(value) => {
                        if (value.length >= 3) {
                          onSearchVehicle(value);
                        }
                      }}
                      title="Placa Dianteira"
                      touched={formik.touched.id_veiculo_parte_motorizada}
                      error={formik.errors.id_veiculo_parte_motorizada}
                      value={formik.values.id_veiculo_parte_motorizada}
                    />
                  </div>
                  <button
                    className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                    type="button"
                    onClick={() => {
                      if (
                        String(formik.values.license_plate_motorized).length > 0
                      ) {
                        onSearchDetailVehicleMotorized(formik.values);
                      }
                    }}
                  >
                    Procurar
                  </button>
                </div>
                {detailVehicleMotorized.length > 0 && (
                  <>
                    <div className="w-full h-[2px] bg-[#DBDEDF] mt-4 mb-4" />
                    <div className="w-full h-full">
                      <div className="flex flex-col mb-3 mt-3">
                        <span className="text-sm text-[#000] font-bold">
                          Dados da placa
                        </span>
                        <span className="text-sm text-[#666666] font-normal mt-3">
                          Dados da placa do veículo
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {detailVehicleMotorized.map((item: IVeiculos) => (
                          <React.Fragment>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Placa Dianteira
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.placa}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                RENAVAM
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.renavam}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Ano de exercício do CRLV
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.ano_exercicio_crlv}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Data expiração do RNTRC
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.data_expiracao_rntrc}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}

                        <div className="w-full mt-4">
                          <SelectCustom
                            data={vehicleTypes}
                            // disabled={
                            //   detailVehicleMotorized.length > 0 &&
                            //   detailVehicleMotorized[0].tipo_veiculo ==
                            //     TipoVeiculo.TRUCK
                            // }
                            onChange={(selectedOption: any) => {
                              formik.setFieldValue(
                                "tipo_veiculo",
                                selectedOption.value
                              );
                            }}
                            title="Tipo Veiculo"
                            touched={formik.touched.tipo_veiculo}
                            error={formik.errors.tipo_veiculo}
                            value={formik.values.tipo_veiculo}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {detailVehicleMotorized.length > 0 && (
                <div className="h-[500px] w-[1px] bg-[#0A4984] ml-3" />
              )}
            </div>
            <div className="w-[50%] h-full flex flex-col">
              {formik.values.tipo_veiculo.length > 0 && formik.values.tipo_veiculo !== "1" && (
                <div className="w-full h-full flex ml-4">
                  <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={vehicleVariants}
                    className="page w-full h-full flex flex-col"
                  >
                    <div className="w-full flex">
                      <div className="flex flex-col w-full">
                        <SelectCustom
                          data={listVehicle}
                          onChange={(selectedOption: any) => {
                            // formik.setFieldValue(
                            //   "id_veiculo_parte_nao_motorizada",
                            //   String(selectedOption.value)
                            // );
                            formik.setFieldValue(
                              "license_plate",
                              selectedOption.label
                            );
                          }}
                          onInputChange={(value) => {
                            if (value.length >= 3) {
                              onSearchVehicle(value);
                            }
                          }}
                          title="Placa Traseira"
                          touched={
                            formik.touched.id_veiculo_parte_nao_motorizada
                          }
                          error={
                            formik.errors.id_veiculo_parte_nao_motorizada
                          }
                          value={
                            formik.values.id_veiculo_parte_nao_motorizada
                          }
                        />
                      </div>

                      <button
                        className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                        type="button"
                        onClick={() => {
                          if (
                            String(formik.values.license_plate).length > 0
                          ) {
                            onSearchDetailVehicle(formik.values, formik.values.license_plate);
                          }
                        }}
                      >
                        Procurar
                      </button>
                    </div>
                    {detailVehicle.length > 0 && (
                      <div className="w-full h-[2px] bg-[#DBDEDF] mt-4" />
                    )}

                    <motion.div
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      variants={detailVehicleVariants}
                      className="page w-full h-full p-2"
                    >
                      {detailVehicle.length > 0 && (
                        <div className="flex flex-col mb-1 mt-3">
                          <span className="text-sm text-[#000] font-bold">
                            Dados da placa
                          </span>
                          <span className="text-sm text-[#666666] font-normal mt-3">
                            Dados da placa do veículo
                          </span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        {detailVehicle.map((item: IVeiculos) => (
                          <React.Fragment>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Placa Dianteira
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.placa}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                RENAVAM
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.renavam}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Ano de exercício do CRLV
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.ano_exercicio_crlv}
                              </span>
                            </div>
                            <div className="flex flex-col items-start">
                              <span className="text-sm text-[#1E2121] font-bold mt-2">
                                Data expiração do RNTRC
                              </span>
                              <span className="text-sm text-[#1E2121] font-light mt-1">
                                {item.data_expiracao_rntrc}
                              </span>
                            </div>
                          </React.Fragment>
                        ))}
                      </div>

                      {detailVehicleMotorized.length > 0 &&
                        detailVehicleMotorized[0].tipo_veiculo !=
                        TipoVeiculo.TRUCK && (
                          <div className="w-full h-[1px] bg-[#0A4984] mr-4" />
                        )}
                    </motion.div>
                  </motion.div>
                </div>
              )}
              {detailVehicleMotorized.length > 0 && (
                <div className="w-full h-full ml-4 mt-2">
                  <div>
                    <span className="text-sm text-[#000] font-bold">
                      Autorização
                    </span>
                  </div>

                  <div className="w-full mt-4">
                    <SelectCustom
                      data={transportadoras}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue(
                          "id_transportadora",
                          selectedOption.value
                        );
                        formik.setFieldValue(
                          "cnpj_transportadora",
                          selectedOption.cnpj
                        );
                      }}
                      title="Transportadoras"
                      touched={formik.touched.id_transportadora}
                      error={formik.errors.id_transportadora}
                      value={formik.values.id_transportadora}
                    />
                  </div>
                  {rowData &&
                    rowData.operacao_porto_agendada &&
                    rowData.operacao_porto_agendada.tipo_carga === 3 && rowData.operacao_porto_agendada.tipo_operacao === 2 && (
                      <div className="flex flex-col w-full mt-5">
                        <Checkbox
                          title="Devolução de Container Cheio"
                          checked={formik.values.identificacao_carga}
                          onChecked={() =>
                            formik.setFieldValue(
                              "identificacao_carga",
                              !formik.values.identificacao_carga
                            )
                          }
                        />
                        <div className="w-11/12 mt-2">
                          <span className="text-[#666666] font-normal text-sm">
                            Deve ser marcado caso seja identificado operação de
                            descarga com container cheio.
                          </span>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="sticky bottom-0 w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
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
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          onClick={() => formik.handleSubmit()}
        >
          Avançar
        </button>
      </div>
    </>
  );
};

export default IdentifyVehicle;
