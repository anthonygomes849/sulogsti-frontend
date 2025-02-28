import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useState } from "react";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import { maskedPlate } from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import { IVeiculos } from "../../../../../../Cadastro/Veiculos/types/types";

// import { Container } from './styles';

interface FormValues {
  id_veiculo: string;
  license_plate: string;
  tipo_placa: number;
}

const IdentifyVehicle: React.FC = () => {
  const [listVehicle, setListVehicle] = useState<any[]>([]);
  const [detailVehicle, setDetailVehicle] = useState<IVeiculos[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const { setStatus } = useStatus();

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

  const initialValues: FormValues = {
    id_veiculo: "",
    license_plate: "",
    tipo_placa: 1,
  };

  const formik = useFormik({
    initialValues,
    // validationSchema: formValidator,
    onSubmit: () => {
      setStatus(2);
    },
  });

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
                  <SelectCustom
                    data={listVehicle}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue("id_veiculo", selectedOption.value);
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
                    title="Placa Dianteira"
                    touched={formik.touched.id_veiculo}
                    error={formik.errors.id_veiculo}
                    value={formik.values.id_veiculo}
                  />
                  <button
                    className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                    type="button"
                    onClick={() => {
                      if (String(formik.values.license_plate).length > 0) {
                        onSearchDetailVehicle(formik.values);
                      }
                    }}
                  >
                    Procurar
                  </button>
                </div>
                <div className="w-full h-[2px] bg-[#DBDEDF] mt-4 mb-4" />
                {detailVehicle.length > 0 && (
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
                  </div>
                )}
              </div>

              <div className="h-[500px] w-[1px] bg-[#0A4984] ml-3" />
            </div>
            <div className="w-[50%] h-full flex ml-4">
            <div className="w-full h-full flex flex-col">
                <div className="w-full flex">
                  <SelectCustom
                    data={listVehicle}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue("id_veiculo", selectedOption.value);
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
                    // touched={formik.touched.id_veiculo}
                    // error={formik.errors.id_veiculo}
                    // value={formik.values.id_veiculo}
                  />
                  <button
                    className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                    type="button"
                    onClick={() => {
                      if (String(formik.values.license_plate).length > 0) {
                        onSearchDetailVehicle(formik.values);
                      }
                    }}
                  >
                    Procurar
                  </button>
                </div>
                <div className="w-full h-[2px] bg-[#DBDEDF] mt-4 mb-4" />

                {detailVehicle.length > 0 && (
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          // onClick={() => formik.handleSubmit()}
        >
          Avançar
        </button>
      </div>
    </>
  );
};

export default IdentifyVehicle;
