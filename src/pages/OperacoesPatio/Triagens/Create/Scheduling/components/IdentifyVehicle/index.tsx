import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import { formatDateBR ,maskedPhone, maskedPlate } from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import { IVeiculos } from "../../../../../../Cadastro/Veiculos/types/types";
import formValidator from "./validators/formValidator";

// import { Container } from './styles';

interface FormValues {
  id_veiculo: string;
  license_plate: string;
  tipo_placa: number;
}

const IdentifyVehicle: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [listDriver, setListDriver] = useState([]);
  const [detailVehicle, setDetailVehicle] = useState<IVeiculos[]>([]);
  const [detailVehicle2, setDetailVehicle2] = useState<IVeiculos[]>([]);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const detailDriverVariants = {
    initial: { opacity: 0, y: -100 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, y: 100, transition: { duration: 0.5 } },
  };

  const { setStatus } = useStatus();

  const onSearchDetailVehicle = useCallback(async (license_plate: string, tipo_placa: number) => {
    try {
      setLoading(true);

      const body = {
        license_plate,
        tipo_placa,
      };

      const response = await api.post("/operacaopatio/searchPlateVehicle", body);

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
  const onSearchDetailVehicle2 = useCallback(async (license_plate: string, tipo_placa: number) => {
    try {
      setLoading(true);

      const body = {
        license_plate,
        tipo_placa,
      };

      const response = await api.post("/operacaopatio/searchPlateVehicle", body);

      if (response.status === 200) {
        let data = [];

        data.push(response.data);

        setDetailVehicle2(data);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onLoadFormValues = useCallback(() => {
    let getDataTriagem: any = sessionStorage.getItem('@triagem');
    if(getDataTriagem) {
      getDataTriagem = JSON.parse(getDataTriagem);
    }

    if(getDataTriagem && getDataTriagem.operacao_porto_agendada !== null) {
      formik.setFieldValue('liscense_plate', getDataTriagem.operacao_porto_agendada.placa_dianteira_veiculo)
      onSearchDetailVehicle(getDataTriagem.operacao_porto_agendada.placa_dianteira_veiculo);
    }
  }, [])

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
            liscense_plate: maskedPlate(item.placa),
            value: item.id_veiculo,
          };
        });

        setListDriver(mappingResponse);
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
    validationSchema: formValidator,
    onSubmit: () => {
      setStatus(2);
    },
  });

  useEffect(() => {
    onLoadFormValues();
  }, [onLoadFormValues])

  return (
    <>
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="page"
    >
      <Loading loading={loading} />
      <div className="overflow-y-scroll max-h-[650px] p-5">
        <div className="flex flex-col mb-3 mt-3">
          <span className="text-sm text-[#000] font-bold">
            Identificação do veiculo
          </span>
          <span className="text-sm text-[#666666] font-normal mt-3">
            Procura do cadastro do veiculo no sistema
          </span>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex items-center w-full mr-20">
            <div className="w-full">
              <SelectCustom
                data={listDriver}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue("id_veiculo", selectedOption.value);
                  formik.setFieldValue("license_plate", selectedOption.liscense_plate);
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
            </div>
            <button
              className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
              type="button"
              onClick={() => {
                console.log(formik.values.license_plate);
                if (String(formik.values.license_plate).length > 0) {
                  onSearchDetailVehicle(formik.values.license_plate, 1);
                }
              }}
            >
              Procurar
            </button>
          </div>
          {detailVehicle.length > 0 && detailVehicle[0].tipo_veiculo != "TRUCK" && (
            <div className="flex items-center w-full ml-3">
              <div className="w-full">
                <SelectCustom
                  data={listDriver}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue("id_veiculo", selectedOption.value);
                    formik.setFieldValue("license_plate", selectedOption.liscense_plate);
                  }}
                  onInputChange={(value) => {
                    if (value.length >= 3) {
                      onSearchVehicle(value);
                    }
                  }}
                  title="Placa Traseira"
                  touched={formik.touched.id_veiculo}
                  error={formik.errors.id_veiculo}
                  value={formik.values.id_veiculo}
                />
              </div>
              <button
                className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                type="button"
                onClick={() => {
                  console.log(formik.values.license_plate);
                  if (String(formik.values.license_plate).length > 0) {
                    onSearchDetailVehicle2(formik.values.license_plate, 2);
                  }
                }}
              >
                Procurar
              </button>
            </div>
          )}
        </div>
        {detailVehicle.length > 0 && (
          <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={detailDriverVariants}
            className="page"
          >
          <div className="w-full h-[1px] bg-[#0A4984] mb-4" />
            <div className="flex flex-col mb-3 mt-3">
              <span className="text-sm text-[#000] font-bold">
                Dados do veiculo
              </span>
              <span className="text-sm text-[#666666] font-normal mt-3">
                Dados do cadastro do veiculo no sistemas
              </span>
            </div>
            <div className="w-3/4 h-full flex grid-cols-2" >
              <div className="w-full grid grid-cols-2 gap-2">
                <div className="w-full grid grid-cols-2 gap-3">
                  {detailVehicle.map((item: IVeiculos) => (
                    <React.Fragment>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Placa Dianteira
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {maskedPlate(item.placa)}
                        </span>
                      </div>
                      {item.renavam && (
                        <div className="flex flex-col items-start">
                          <span className="text-sm text-[#1E2121] font-bold mt-2">
                            Renavam
                          </span>
                          <span className="text-sm text-[#1E2121] font-light mt-1">
                            {item.renavam}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Ano exercicio CRLV
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.ano_exercicio_crlv}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Data expiração RNTC
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {formatDateBR(item.data_expiracao_rntrc)}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                      <span className="text-sm text-[#1E2121] font-bold mt-2">
                        Tipo veiculo
                      </span>
                      <span className="text-sm text-[#1E2121] font-light mt-1">
                        {item.tipo_veiculo}
                      </span>
                    </div>
                    </React.Fragment>
                  ))}
                </div>
                <div className="w-full grid grid-cols-2 gap-3 ml-40">
                  {detailVehicle2.length > 0 && detailVehicle2.map((item: IVeiculos) => (
                  <React.Fragment>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-[#1E2121] font-bold mt-2">
                        Placa Traseira
                      </span>
                      <span className="text-sm text-[#1E2121] font-light mt-1">
                        {maskedPlate(item.placa)}
                      </span>
                    </div>
                    {item.renavam && (
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Renavam
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.renavam}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-[#1E2121] font-bold mt-2">
                        Ano exercicio CRLV
                      </span>
                      <span className="text-sm text-[#1E2121] font-light mt-1">
                        {item.ano_exercicio_crlv}
                      </span>
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-[#1E2121] font-bold mt-2">
                        Data expiração RNTC
                      </span>
                      <span className="text-sm text-[#1E2121] font-light mt-1">
                        {formatDateBR(item.data_expiracao_rntrc)}
                      </span>
                    </div>
                  </React.Fragment>
                ))}
                </div>
            </div>
            </div>
            <div className="w-full h-[2px] bg-[#DBDEDF] mt-4" />
            <div className="flex flex-col mb-3 mt-6">
              <span className="text-sm text-[#000] font-bold">
              Confirmação da identidade
              </span>
              <span className="text-sm text-[#666666] font-normal mt-2">
              O funcionário deve confirmar a identidade por verificação de documentos com fotos e demais protocolos definidos. 
              </span>
            </div>
          </motion.div>
        )}
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