import { useFormik } from "formik";
import { motion } from "framer-motion";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import CalendarIcon from "../../../../../../../assets/images/calendarIcon.svg";
import CalendarIconActive from "../../../../../../../assets/images/calendarIconActive.svg";
import CarrosselIcon from "../../../../../../../assets/images/carrosselIcon.svg";
import CarrosselIconActive from "../../../../../../../assets/images/carrouselIconActive.svg";
import SelectCustom from "../../../../../../../components/SelectCustom";
import Loading from "../../../../../../../core/common/Loading";
import {
  formatDateBR,
  formatDateTimeBR,
  maskedCPF,
} from "../../../../../../../helpers/format";
import { useStatus } from "../../../../../../../hooks/StatusContext";
import api from "../../../../../../../services/api";
import { FrontendNotification } from "../../../../../../../shared/Notification";
import { IOperacoesPortoAgendada } from "../../../../../../OperacoesPorto/OperacoesPortoAgendada/types/types";
import { IOperacoesPatioEntradaVeiculos } from "../../../../../OperacoesPatioEntradaVeiculos/Create/types/types";
import ChoiceBox from "../shared/ChoiceBox";
import formValidator from "./validators/formValidator";

interface FormValues {
  id_operacao_entrada_veiculo: string;
  id_operacao_porto_agendada: string;
  id_operacao_porto_carrossel: string;
  tipo_operacao_porto: string;
}

const Associate: React.FC = () => {
  const [, setEntradaVeiculo] = useState([]);
  const [, setOperacaoPortoAgendada] = useState([]);
  const [operacaoPortoCarrossel, setOperacaoPortoCarrossel] = useState([]);
  const [, setSearchQueryEntrada] = useState<string>("");
  const [, setSearchQueryAgendada] = useState<string>("");
  const [isAssociate, setIsAssociate] = useState(false);

  const selectRef: any = useRef(null);

  const pageVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.8 } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.5 } },
  };

  const [choiceOptions, setChoiceOptions] = useState([
    {
      id: 0,
      label: "Agendada",
      icon: CalendarIcon,
    },
    {
      id: 1,
      label: "Carrossel",
      icon: CarrosselIcon,
    },
  ]);

  const [loading, setLoading] = useState<boolean>(false);

  const { setStatus } = useStatus();

  const onSubmit = useCallback(
    async (values: FormValues, isAssociate: boolean) => {
      try {
        setLoading(true);

        let body;
        if (String(values.id_operacao_porto_agendada).length > 0) {
          body = {
            id_operacao_patio_entrada_veiculo:
              values.id_operacao_entrada_veiculo,
            id_operacao_porto_agendada: values.id_operacao_porto_agendada,
            status: 6,
          };
        } else {
          body = {
            id_operacao_patio_entrada_veiculo:
              values.id_operacao_entrada_veiculo,
            id_operacao_porto_carrossel: values.id_operacao_porto_carrossel,
            status: 6,
          };
        }

        const response = await api.post("/editar/operacaoPatioTriagem", body);

        if (response.status === 200) {
          sessionStorage.setItem(
            "id_operacao_patio",
            response.data.id_operacao_patio
          );

          sessionStorage.setItem("@triagem", JSON.stringify(response.data));

          if (isAssociate) {
            window.location.reload();
          } else {
            setStatus(1);
          }
        } else {
          setLoading(false);
          FrontendNotification("Erro ao associar a entrada a triagem", "error");
        }
        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification("Erro ao associar a entrada a triagem", "error");
      }
    },
    []
  );

  const getOperacoesPatioEntradaVeiculo = useCallback(async (value: string) => {
    try {
      setLoading(true);

      const body = {
        order_by: "data_hora",
        order_direction: "desc",
        qtd_por_pagina: 100,
        triagem: "sim",
        placa_dianteira: value.toUpperCase(),
      };

      const response = await api.post("/listar/entradaSaidaVeiculos", body);

      console.log(response.data.data);

      const mappingResponse = response.data.data.map(
        (item: IOperacoesPatioEntradaVeiculos) => {
          return {
            label: `${formatDateTimeBR(item.data_hora)} | ${
              item.placa_dianteira
            } | ${
              item.cancela !== null
                ? `Cancela ${item.cancela.numero_cancela}`
                : ""
            }`,
            value: item.id_operacao_patio_entrada_veiculo,
          };
        }
      );

      console.log(mappingResponse);

      setEntradaVeiculo(mappingResponse);

      setLoading(false);

      return mappingResponse;
    } catch {
      setLoading(false);
    }
  }, []);

  const getOperacoesPortoCarrossel = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        order_by: "data_historico",
        order_direction: "desc",
        qtd_por_pagina: 100,
        triagem: "sim",
      };

      const response = await api.post("/listar/operacaoPortoCarrossel", body);

      const mappingResponse = response.data.data.map((item: any) => {
        return {
          label: `${formatDateBR(item.data_inicio_operacao)} | ${
            item.nome_fantasia
          }`,
          value: item.id_operacao_porto_carrossel,
        };
      });

      setOperacaoPortoCarrossel(mappingResponse);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getOperacaoPortoAgendada = useCallback(async (value: string) => {
    try {
      setLoading(true);
      let body: any = {
        order_by: "data_historico",
        order_direction: "desc",
        qtd_por_pagina: 100,
        triagem: "sim",
        placa: value.toUpperCase(),
      };

      if (value.length > 7) {
        body = {
          order_by: "data_historico",
          order_direction: "desc",
          qtd_por_pagina: 100,
          triagem: "sim",
          identificadores_conteineres: value.toUpperCase(),
        };
      }

      const response = await api.post("/listar/operacaoPortoAgendada", body);

      const mappingResponse = response.data.data.map(
        (item: IOperacoesPortoAgendada) => {
          return {
            label: `${formatDateTimeBR(item.data_agendamento_terminal)} | ${
              item.terminal !== null ? item.terminal.razao_social : ""
            } | ${item.placa_dianteira_veiculo} | ${
              item.placa_traseira_veiculo !== null
                ? item.placa_traseira_veiculo
                : ""
            } | ${
              item.cpf_motorista !== null ? maskedCPF(item.cpf_motorista) : ""
            } | ${
              item.identificadores_conteineres !== null
                ? item.identificadores_conteineres
                : ""
            }`,
            value: item.id_operacao_porto_agendada,
          };
        }
      );

      setOperacaoPortoAgendada(mappingResponse);

      setLoading(false);
      return mappingResponse;
    } catch {
      setLoading(false);
    }
  }, []);

  const initialValues: FormValues = {
    id_operacao_entrada_veiculo: "",
    id_operacao_porto_agendada: "",
    id_operacao_porto_carrossel: "",
    tipo_operacao_porto: "2",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      onSubmit(values, isAssociate);
    },
  });

  const loadOptionsAgendada = async (inputValue: string, callback: any) => {
    if (inputValue.length < 3) {
      // Não carrega nada se menos de 3 caracteres
      callback([]);
      return;
    }

    return await getOperacaoPortoAgendada(inputValue);
  };

  const loadOptions = async (inputValue: string, callback: any) => {
    if (inputValue.length < 3) {
      // Não carrega nada se menos de 3 caracteres
      callback([]);
      return;
    }

    return await getOperacoesPatioEntradaVeiculo(inputValue);
  };

  useEffect(() => {
    getOperacoesPortoCarrossel();
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <ToastContainer />
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className="page"
      >
        <div className="overflow-y-scroll max-h-[calc(80vh - 50px)] p-5">
          <div className="mb-5">
            <span className="text-sm font-bold">
              Entrada do Veículo no Pátio
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4 mt-4">
            <div>
              <SelectCustom
                async
                selectRef={selectRef}
                data={loadOptions}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue(
                    "id_operacao_entrada_veiculo",
                    selectedOption.value
                  );
                }}
                onInputChange={(value) => {
                  setSearchQueryEntrada(value);
                }}
                title="Entrada Associada à Triagem"
                touched={formik.touched.id_operacao_entrada_veiculo}
                error={formik.errors.id_operacao_entrada_veiculo}
                // disabled={props.isView}
                value={formik.values.id_operacao_entrada_veiculo}
              />
            </div>
          </div>
          <div className="w-full h-[2px] bg-[#DBDEDF]" />
          <div className="mt-4 mb-5">
            <span className="text-sm font-bold">Operação no Porto</span>
          </div>

          <div className="flex items-center w-full">
            <span className="text-sm font-bold">Tipo de Operação no Porto</span>
          </div>

          <ChoiceBox
            data={choiceOptions}
            onChange={(value: number) => {
              formik.setFieldValue("tipo_operacao_porto", value);

              setChoiceOptions([
                {
                  id: 0,
                  label: "Agendada",
                  icon: value === 0 ? CalendarIconActive : CalendarIcon,
                },
                {
                  id: 1,
                  label: "Carrossel",
                  icon: value === 1 ? CarrosselIconActive : CarrosselIcon,
                },
              ]);
            }}
            value={formik.values.tipo_operacao_porto}
          />

          {formik.touched.tipo_operacao_porto &&
            formik.errors.tipo_operacao_porto && (
              <span className="text-sm text-[#EA004C] font-bold">
                {formik.errors.tipo_operacao_porto}
              </span>
            )}

          <div className="grid grid-cols-3 gap-3 mb-3 mt-4">
            <div>
              {Number(formik.values.tipo_operacao_porto) === 0 ? (
                <SelectCustom
                  async
                  selectRef={selectRef}
                  data={loadOptionsAgendada}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "id_operacao_porto_agendada",
                      selectedOption.value
                    );
                  }}
                  onInputChange={(value) => {
                    setSearchQueryAgendada(value);
                  }}
                  title="Operação Agendada"
                  touched={formik.touched.id_operacao_porto_agendada}
                  error={formik.errors.id_operacao_porto_agendada}
                  value={formik.values.id_operacao_porto_agendada}
                />
              ) : // <SelectCustom
              //   data={operacaoPortoAgendada}
              //   onChange={(selectedOption: any) => {
              //     formik.setFieldValue(
              //       "id_operacao_porto_agendada",
              //       selectedOption.value
              //     );
              //   }}
              //   title="Operação Agendada"
              //   touched={formik.touched.id_operacao_porto_agendada}
              //   error={formik.errors.id_operacao_porto_agendada}
              //   value={formik.values.id_operacao_porto_agendada}
              // />
              Number(formik.values.tipo_operacao_porto) === 1 ? (
                <SelectCustom
                  data={operacaoPortoCarrossel}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "id_operacao_porto_carrossel",
                      selectedOption.value
                    );
                  }}
                  title="Operação Carrossel"
                  touched={formik.touched.id_operacao_porto_carrossel}
                  error={formik.errors.id_operacao_porto_carrossel}
                  value={formik.values.id_operacao_porto_carrossel}
                />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="sticky bottom-0 w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-36 h-9 pl-3 pr-3 flex items-center justify-center bg-[#F9FAFA] text-sm text-[#000] font-bold rounded-full mr-2 shadow-md"
          onClick={() => {
            setIsAssociate(true);
            formik.handleSubmit();
          }}
          style={{ border: "1px solid #DBDEDF" }}
        >
          Entrou no Pátio
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

export default Associate;
