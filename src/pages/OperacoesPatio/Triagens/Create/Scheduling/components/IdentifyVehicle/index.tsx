import { format } from "date-fns";
import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import { maskedPlate } from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import {
  IVeiculos,
  TipoVeiculo,
} from "../../../../../../Cadastro/Veiculos/types/types";
// import Checkbox from "./components/Checkbox";
import formValidator from "./validators/formValidator";
import formValidator2 from "./validators/formValidator2";

// import { Container } from './styles';

interface FormValues {
  id_veiculo_parte_motorizada: string;
  id_veiculo_parte_nao_motorizada: string;
  license_plate_motorized: string;
  license_plate: string;
  id_transportadora: string;
  cnpj_transportadora: string;
  tipo_placa: number;
  tipo_veiculo: number;
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

  const onUpdateAutorizacao = useCallback(async (values: FormValues, idOperacaoPatio: number, idUser: string | null) => {
    try {
      setLoading(true);

      const body = {
        id_operacao_patio: idOperacaoPatio,
        identificacao_carga: values.identificacao_carga,
        cnpj_transportadora: values.cnpj_transportadora.length > 0 && values.cnpj_transportadora != "-1" ? values.cnpj_transportadora : null,
        autorizacao_faturar: values.cnpj_transportadora.length > 0 && values.cnpj_transportadora != "-1" ? true : false,
        status: 10,
        id_usuario_historico: idUser
      };
      

      const response = await api.post('/operacaopatio/adicionarAutorizacao', body); 

      if (response.status === 200) {

        setStatus(3);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const handleSubmit = useCallback(async (values: FormValues) => {
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
        currentRow && currentRow.id_operacao_patio
          ? currentRow.id_operacao_patio
          : idOperacaoPatio;

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
        tipo_veiculo: 1,
        data_hora_identificacao: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        id_usuario_historico: userId,
        status: 5,
      };

      const response = await api.post(
        "/operacaopatio/confirmVehicleIdentity",
        body
      );

      if (response.status === 200) {
        sessionStorage.setItem("id_operacao_patio", response.data);

        onUpdateAutorizacao(values, id, userId);
      }

      setLoading(false);
    } catch {
      setLoading(false);
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
          tipo_placa: value,
        };

        const response = await api.post("/listar/veiculos", body);

        const mappingResponse = response.data.data.map((item: IVeiculos) => {
          return {
            label: `${maskedPlate(item.placa)}`,
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

  const onSearchDetailVehicle = useCallback(async (values: FormValues) => {
    try {
      setLoading(true);

      const body = {
        license_plate: values.license_plate,
        tipo_placa: values.tipo_placa,
      };

      const response = await api.post(
        "/operacaopatio/searchPlateVehicle",
        body
      );

      if (response.status === 200) {
        let data = [];

        data.push(response.data);

        setDetailVehicle(data);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onSearchDetailVehicleMotorized = useCallback(
    async (values: FormValues) => {
      try {
        setLoading(true);

        const body = {
          license_plate: values.license_plate_motorized,
          tipo_placa: values.tipo_placa,
        };

        const response = await api.post(
          "/operacaopatio/searchPlateVehicle",
          body
        );

        if (response.status === 200) {
          let data = [];

          data.push(response.data);

          setDetailVehicleMotorized(data);
        }

        setLoading(false);
      } catch {
        setLoading(false);
      }
    },
    []
  );

  const getTransportadoras = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post("/listar/transportadoras", body);

      if (response.status === 200) {
        let mappingResponse = response.data.data.map((item: any) => {
          return {
            label: item.razao_social,
            value: item.id_transportadora,
            cnpj: item.cnpj,
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
    const data = Object.values(TipoVeiculo).map((value: any, index: number) => {
      return {
        value: `${index + 1}`,
        label: value,
      };
    });

    setVehicleTypes(data);
  }, []);

  const initialValues: FormValues = {
    id_veiculo_parte_motorizada: "",
    id_veiculo_parte_nao_motorizada: "",
    license_plate_motorized: "",
    license_plate: "",
    id_transportadora: "",
    cnpj_transportadora: "",
    tipo_placa: 1,
    tipo_veiculo: 0,
    identificacao_carga: false,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: detailVehicleMotorized.length > 0 &&
    detailVehicleMotorized[0].tipo_veiculo != TipoVeiculo.TRUCK ? formValidator2 : formValidator,
    onSubmit: (values: FormValues) => {
      handleSubmit(values);
    },
  });

  useEffect(() => {
    getTransportadoras();
    getVehicleTypes();
  }, [getVehicleTypes]);

  return (
    <>
      <Loading loading={loading} />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <div className="overflow-y-scroll max-h-[650px] p-5">
          <div className="flex flex-col mb-3 mt-3">
            <span className="text-sm text-[#000] font-bold">
              Identificação da placa
            </span>
            <span className="text-sm text-[#666666] font-normal mt-3">
              Procura do cadastro do veículo
            </span>
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
                            onChange={(selectedOption: any) => {
                              // formik.setFieldValue(
                              //   "id_veiculo_parte_motorizada",
                              //   selectedOption.value
                              // );
                              // formik.setFieldValue(
                              //   "license_plate_motorized",
                              //   selectedOption.label
                              // );
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
              {detailVehicleMotorized.length > 0 &&
                detailVehicleMotorized[0].tipo_veiculo != TipoVeiculo.TRUCK && (
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
                            formik.setFieldValue(
                              "id_veiculo_parte_nao_motorizada",
                              String(selectedOption.value)
                            );
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
                          error={formik.errors.id_veiculo_parte_nao_motorizada}
                          value={formik.values.id_veiculo_parte_nao_motorizada}
                        />
                        </div>

                        <button
                          className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                          type="button"
                          onClick={() => {
                            if (
                              String(formik.values.license_plate).length > 0
                            ) {
                              onSearchDetailVehicle(formik.values);
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
                          selectedOption.label
                        );
                      }}
                      title="Transportadoras"
                      touched={formik.touched.id_transportadora}
                      error={formik.errors.id_transportadora}
                      value={formik.values.id_transportadora}
                    />
                  </div>
                  <div className="flex flex-col w-full mt-4">
                    {/* <Checkbox
                      title="Devolução de Container Cheio"
                      checked={formik.values.identificacao_carga}
                      onChecked={() =>
                        formik.setFieldValue(
                          "identificacao_carga",
                          !formik.values.identificacao_carga
                        )
                      }
                    /> */}
                    <div className="w-11/12 mt-2">
                      <span className="text-[#666666] font-normal text-sm">Deve ser marcado caso seja identificado operação de descarga com container cheio.</span>
                      </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
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
