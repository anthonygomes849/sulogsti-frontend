import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import {
  formatDateBR,
  maskedCPF,
  maskedPhone,
} from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import { FrontendNotification } from "../../../../../../../shared/Notification";
import { IMotorista } from "../../../../../../Cadastro/Motoristas/Create/types/types";
import formValidator from "./validators/formValidator";

// import { Container } from './styles';

interface FormValues {
  id_motorista: string;
  cpf_motorista: string;
}

const IdentifyDriver: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [, setListDriver] = useState([]);
  const [detailDriver, setDetailDriver] = useState<IMotorista[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchDriver, setSearchDriver] = useState();

  const selectRef: any = useRef(null);

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
        idOperacaoPatio && idOperacaoPatio.length > 0
          ? idOperacaoPatio
          : currentRow.id_operacao_patio;

      const body = {
        id_operacao_patio: id,
        id_motorista: values.id_motorista,
        id_usuario_historico: userId,
        status: 4,
      };

      const response = await api.post(
        "/operacaopatio/confirmDriverIdentity",
        body
      );

      if (response.status === 200) {
        sessionStorage.setItem("id_operacao_patio", response.data);
        setStatus(2);
      } else {
        FrontendNotification("Erro ao identificar o motorista", "error");
      }

      setLoading(false);
    } catch {
      setLoading(false);
      FrontendNotification("Erro ao identificar o motorista", "error");
    }
  }, []);

  const onSearchDetailDriver = useCallback(async (cpf: string) => {
    try {
      setLoading(true);

      const body = {
        cpf,
      };

      const response = await api.post("/operacaopatio/searchDriver", body);

      if (response.status === 200) {
        if (response.data) {
          let data = [];

          data.push(response.data);

          setDetailDriver(data);

          let getDataTriagem: any = sessionStorage.getItem("@triagem");
          if (getDataTriagem) {
            getDataTriagem = JSON.parse(getDataTriagem);
          }

          if (
            getDataTriagem &&
            getDataTriagem.operacao_porto_agendada !== null &&
            response.data
          ) {
            formik.setFieldValue("id_motorista", response.data.id_motorista);
          }
        }
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onLoadFormValues = useCallback(() => {
    let getDataTriagem: any = sessionStorage.getItem("@triagem");
    if (getDataTriagem) {
      getDataTriagem = JSON.parse(getDataTriagem);
    }

    if (getDataTriagem && getDataTriagem.operacao_porto_agendada !== null) {
      formik.setFieldValue(
        "cpf_motorista",
        getDataTriagem.operacao_porto_agendada.cpf_motorista
      );

      onSearchDetailDriver(
        getDataTriagem.operacao_porto_agendada.cpf_motorista
      );
    }
  }, []);

  const onSearchDriver = useCallback(async (value: string) => {
    try {
      setLoading(true);

      if (value.length > 0) {
        const body = {
          order_by: "data_historico",
          order_direction: "desc",
          qtd_por_pagina: 100,
          cpf: value,
        };

        const response = await api.post("/listar/motoristas", body);

        const mappingResponse = response.data.data.map((item: IMotorista) => {
          return {
            label: `${maskedCPF(item.cpf)} | ${item.nome}`,
            cpf: item.cpf,
            value: item.id_motorista,
          };
        });

        setListDriver(mappingResponse);
        setLoading(false);

        return mappingResponse;
      }
      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const initialValues: FormValues = {
    id_motorista: "",
    cpf_motorista: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      if (detailDriver.length > 0) {
        handleSubmit(values);
      }
    },
  });

  useEffect(() => {
    if (searchQuery.length >= 3) {
      onSearchDriver(searchQuery);
    }
  }, [searchQuery]);

  useEffect(() => {
    onLoadFormValues();
  }, [onLoadFormValues]);

  return (
    <>
      <ToastContainer />
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
              Identificação de motorista
            </span>
            <span className="text-sm text-[#666666] font-normal mt-3">
              Procura do cadastro de motorista no sistema
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center w-full">
              <div className="w-full">
                <SelectCustom
                  async
                  selectRef={selectRef}
                  data={onSearchDriver}
                  onChange={(selectedOption: any) => {
                    setSearchDriver(selectedOption);
                    formik.setFieldValue("id_motorista", selectedOption.value);
                    formik.setFieldValue("cpf_motorista", selectedOption.cpf);
                  }}
                  onInputChange={(value) => {
                    setSearchQuery(value);
                  }}
                  title="CPF do Motorista"
                  touched={formik.touched.id_motorista}
                  error={formik.errors.id_motorista}
                  value={formik.values.cpf_motorista}
                  defaultValue={searchDriver}
                />
              </div>
              <button
                className="w-full max-w-28 h-10 flex items-center justify-center border-none rounded-full bg-[#0A4984] text-base text-[#fff] font-bold mt-6 ml-3 cursor-pointer"
                type="button"
                onClick={() => {
                  if (String(formik.values.cpf_motorista).length > 0) {
                    onSearchDetailDriver(formik.values.cpf_motorista);
                  }
                }}
              >
                Procurar
              </button>
            </div>
          </div>
          {detailDriver.length > 0 && (
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
                  Dados do motorista
                </span>
                <span className="text-sm text-[#666666] font-normal mt-3">
                  Dados do cadastro do motorista no sistemas
                </span>
              </div>
              <div className="w-2/3 h-full flex">
                <div className="w-full grid grid-cols-2 gap-3">
                  {detailDriver.map((item: IMotorista) => (
                    <React.Fragment>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          CPF
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.cpf && item.cpf.length > 0
                            ? maskedCPF(item.cpf)
                            : "---"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Nome
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.nome}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Cidade | Estado
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.cidade !== null ? item.cidade : "---"}{" "}
                          {item.uf_estado !== null ? item.uf_estado : ""}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Celular
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.celular && item.celular.length > 0
                            ? maskedPhone(item.celular)
                            : "---"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          CNH | Categoria | Data Expiração
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          {item.numero_cnh && item.numero_cnh !== null
                            ? `${maskedCPF(item.numero_cnh)} |`
                            : "---"}{" "}
                          {item.categoria_cnh && item.categoria_cnh !== null
                            ? `${item.categoria_cnh} |`
                            : "---"}{" "}
                          {item.data_expiracao_cnh &&
                          item.data_expiracao_cnh !== null
                            ? formatDateBR(item.data_expiracao_cnh)
                            : "---"}
                        </span>
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-sm text-[#1E2121] font-bold mt-2">
                          Situação
                        </span>
                        <span className="text-sm text-[#1E2121] font-light mt-1">
                          OK
                        </span>
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="w-full h-[2px] bg-[#DBDEDF] mt-4" />
              <div className="flex flex-col mb-3 mt-6">
                <span className="text-sm text-[#000] font-bold">
                  Confirmação da identidade
                </span>
                <span className="text-sm text-[#666666] font-normal mt-2">
                  O funcionário deve confirmar a identidade por verificação de
                  documentos com fotos e demais protocolos definidos.
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

export default IdentifyDriver;
