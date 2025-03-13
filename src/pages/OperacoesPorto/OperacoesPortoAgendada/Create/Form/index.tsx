import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { Label } from "reactstrap";
import InputCustom from "../../../../../components/InputCustom";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import { validateCPF } from "../../../../../helpers/format";
import api from "../../../../../services/api";
import { FrontendNotification } from "../../../../../shared/Notification";
import { ITerminal } from "../../../../Cadastro/Terminal/Create/types/types";
import {
  CargaType,
  IOperacoesPortoAgendada,
  OperationType,
} from "../../types/types";
import formValidator from "../validators/formValidator";

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IOperacoesPortoAgendada;
  onConfirm: () => void;
  onClose: () => void;
}

interface FormValues {
  data_agendamento_terminal: string;
  placa_dianteira_veiculo: string;
  placa_traseira_veiculo: string;
  identificadores_conteineres: string;
  tipo_carga: string;
  tipo_operacao: string;
  id_terminal: string;
  tolerancia_inicial: string;
  tolerancia_final: string;
  cpf_motorista: string;
  cnpj_transportadora: string;
}

const Form: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [terminais, setTerminal] = useState([]);
  const [cargoTypes, setCargoTypes] = useState<any[]>([]);
  const [operationTypes, setOperationTypes] = useState<any[]>([]);
  const [conteiners, setConteiners] = useState({
    conteiners1: "",
    conteiners2: "",
    conteiners3: "",
    conteiners4: "",
  });

  const handleSubmit = useCallback(
    async (
      values: FormValues,
      row?: IOperacoesPortoAgendada,
      listConteiners?: any
    ) => {
      try {
        setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        let getIndentificadorConteiner = "{";

        if (listConteiners.conteiners1.length > 0) {
          getIndentificadorConteiner += `${listConteiners.conteiners1},`;
        } else if (listConteiners.conteiners2.length > 0) {
          getIndentificadorConteiner += `${listConteiners.conteiners2},`;
        } else if (listConteiners.conteiners3.length > 0) {
          getIndentificadorConteiner += `${listConteiners.conteiners3},`;
        } else if (listConteiners.conteiners4.length > 0) {
          getIndentificadorConteiner += `${listConteiners.conteiners4}`;
        }

        getIndentificadorConteiner += "}";

        const conteiners = getIndentificadorConteiner.slice(0, -2) + "}";

        console.log(conteiners);

        if (validateCPF(values.cpf_motorista)) {
          const body = {
            id_operacao_porto_agendada: row?.id_operacao_porto_agendada,
            data_agendamento_terminal: format(
              new Date(values.data_agendamento_terminal),
              "yyyy-MM-dd HH:mm:ss",
              {
                locale: ptBR,
              }
            ),
            cpf_motorista: String(values.cpf_motorista)
              .replaceAll(".", "")
              .replace("-", ""),
            placa_dianteira_veiculo: values.placa_dianteira_veiculo.replace(
              "-",
              ""
            ),
            placa_traseira_veiculo:
              values.placa_traseira_veiculo.length > 0
                ? values.placa_traseira_veiculo.replace("-", "")
                : null,
            tolerancia_inicio_agendamento: values.tolerancia_inicial,
            tolerancia_fim_agendamento: values.tolerancia_final,
            id_terminal: values.id_terminal,
            tipo_carga: Number(values.tipo_carga),
            tipo_operacao: Number(values.tipo_operacao),
            identificadores_conteineres:
              getIndentificadorConteiner.length > 2
                ? conteiners.replaceAll("-", "")
                : null,
            ativo: true,
            id_usuario_historico: userId,
            origem: 1,
            status: 1,
          };

          if (props.isEdit) {
            const response = await api.post(
              "/editar/operacaoPortoAgendada",
              body
            );

            if (response.status === 200) {
              props.onConfirm();
            } else {
              FrontendNotification("Erro ao salvar o agendamento!", "error");
            }
          } else {
            const response = await api.post(
              "/cadastrar/operacaoPortoAgendada",
              body
            );

            if (response.status === 200) {
              props.onConfirm();
            } else {
              FrontendNotification("Erro ao salvar o agendamento!", "error");
            }
          }
        } else {
          FrontendNotification("CPF inválido", "error");
        }

        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification("Erro ao salvar o agendamento!", "error");
      }
    },
    []
  );

  const getTerminais = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        order_by: "data_historico",
        order_direction: "desc",
        qtd_por_pagina: 100,
      };

      const response = await api.post("/listar/terminais", body);

      if (response.status === 200) {
        const mappingResponse = response.data.data.map((item: ITerminal) => {
          return {
            label: item.razao_social,
            value: item.id_terminal,
          };
        });
        setTerminal(mappingResponse);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getCargoTypes = useCallback(() => {
    const data = Object.values(CargaType).map((value: any, index: number) => {
      return {
        value: `${index + 1}`,
        label: value,
      };
    });

    setCargoTypes(data);
  }, []);

  const getOperationTypes = useCallback(() => {
    const data = Object.values(OperationType).map(
      (value: any, index: number) => {
        return {
          value: `${index + 1}`,
          label: value,
        };
      }
    );

    setOperationTypes(data);
  }, []);

  const onLoadFormValues = useCallback((row?: IOperacoesPortoAgendada) => {
    const data = row;

    if (data) {
      formik.setFieldValue(
        "data_agendamento_terminal",
        data.data_agendamento_terminal
      );
      formik.setFieldValue(
        "placa_dianteira_veiculo",
        data.placa_dianteira_veiculo
      );
      formik.setFieldValue(
        "placa_traseira_veiculo",
        data.placa_traseira_veiculo
      );
      formik.setFieldValue(
        "tolerancia_inicial",
        data.tolerancia_inicio_agendamento
      );
      formik.setFieldValue("tolerancia_final", data.tolerancia_fim_agendamento);
      formik.setFieldValue("id_terminal", data.id_terminal);
      formik.setFieldValue("tipo_carga", data.tipo_carga);
      formik.setFieldValue("cpf_motorista", data.cpf_motorista);
      formik.setFieldValue("cnpj_transportadora", data.cnpj_transportadora);

      if (
        data.identificadores_conteineres !== null &&
        data.identificadores_conteineres.length > 0
      ) {
        const getConteineres = data.identificadores_conteineres
          .replace("{", "")
          .replace("}", "");

        const mappingConteiners = getConteineres.split(",");

        setConteiners({
          conteiners1: mappingConteiners[0] ? mappingConteiners[0] : "",
          conteiners2: mappingConteiners[1] ? mappingConteiners[1] : "",
          conteiners3: mappingConteiners[2] ? mappingConteiners[2] : "",
          conteiners4: mappingConteiners[3] ? mappingConteiners[3] : "",
        });
      }

      // formik.setFieldValue("placa_dianteira", data.placa_dianteira);
      // formik.setFieldValue("placa_traseira", data.placa_traseira);
      // formik.setFieldValue("numero_partes_nao_motorizada", data.numero_partes_nao_motorizada);
      // formik.setFieldValue("id_operacao_patio_cancela", data.id_operacao_patio_cancela);
      // formik.setFieldValue("id_operacao_patio_cancela_saida", data.id);
      // formik.setFieldValue("anoExercicioCRLV", data.ano_exercicio_crlv);
      // formik.setFieldValue("livreAcessoPatio", data.livre_acesso_patio);
      // formik.setFieldValue("ativo", data.ativo);
    }
  }, []);

  const initialValues: FormValues = {
    placa_dianteira_veiculo: "",
    placa_traseira_veiculo: "",
    data_agendamento_terminal: "",
    id_terminal: "",
    tolerancia_inicial: "",
    tolerancia_final: "",
    tipo_carga: "",
    tipo_operacao: "",
    identificadores_conteineres: "",
    cpf_motorista: "",
    cnpj_transportadora: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      handleSubmit(values, props.selectedRow, conteiners);
    },
  });

  useEffect(() => {
    getTerminais();
    getCargoTypes();
    getOperationTypes();
  }, [getTerminais, getCargoTypes, getOperationTypes]);

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <ToastContainer />
      <div className="overflow-y-scroll max-h-[550px] p-5">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <InputCustom
              title="Data Hora"
              type="datetime-local"
              placeholder=""
              onChange={formik.handleChange("data_agendamento_terminal")}
              value={formik.values.data_agendamento_terminal}
              touched={formik.touched.data_agendamento_terminal}
              error={formik.errors.data_agendamento_terminal}
              disabled={props.isView}
            />
          </div>

          <div>
            <InputCustom
              title="Tolerância Inicial"
              type="number"
              placeholder=""
              onChange={formik.handleChange("tolerancia_inicial")}
              value={formik.values.tolerancia_inicial}
              touched={formik.touched.tolerancia_inicial}
              error={formik.errors.tolerancia_inicial}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Tolerância Inicial"
              type="number"
              placeholder=""
              onChange={formik.handleChange("tolerancia_final")}
              value={formik.values.tolerancia_final}
              touched={formik.touched.tolerancia_final}
              error={formik.errors.tolerancia_final}
              disabled={props.isView}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <SelectCustom
              data={terminais}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("id_terminal", selectedOption.value);
              }}
              title="Terminal"
              touched={formik.touched.id_terminal}
              error={formik.errors.id_terminal}
              disabled={props.isView}
              value={formik.values.id_terminal}
            />
          </div>
          <div>
            <SelectCustom
              data={cargoTypes}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("tipo_carga", selectedOption.value);
              }}
              title="Tipo de Carga"
              touched={formik.touched.tipo_carga}
              error={formik.errors.tipo_carga}
              disabled={props.isView}
              value={formik.values.tipo_carga}
            />
          </div>
          <div>
            <SelectCustom
              data={operationTypes}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("tipo_operacao", selectedOption.value);
              }}
              title="Tipo de Operação"
              touched={formik.touched.tipo_operacao}
              error={formik.errors.tipo_operacao}
              disabled={props.isView}
              value={formik.values.tipo_operacao}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div>
            <InputCustom
              title="CPF Motorista"
              typeInput="mask"
              mask="999.999.999-99"
              placeholder=""
              onChange={formik.handleChange("cpf_motorista")}
              value={formik.values.cpf_motorista}
              touched={formik.touched.cpf_motorista}
              error={formik.errors.cpf_motorista}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Placa Dianteira Veículo"
              typeInput="mask"
              mask="aaa-9*99"
              placeholder=""
              onChange={formik.handleChange("placa_dianteira_veiculo")}
              value={formik.values.placa_dianteira_veiculo}
              touched={formik.touched.placa_dianteira_veiculo}
              error={formik.errors.placa_dianteira_veiculo}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Placa Traseira Veiculo"
              typeInput="mask"
              mask="aaa-9*99"
              placeholder=""
              onChange={formik.handleChange("placa_traseira_veiculo")}
              value={formik.values.placa_traseira_veiculo}
              touched={formik.touched.placa_traseira_veiculo}
              error={formik.errors.placa_traseira_veiculo}
              disabled={props.isView}
              isRequired={false}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <Label
              style={{
                fontFamily: "Poppins",
                fontSize: "0.875rem",
                color: "#000000",
                fontWeight: 500,
                display: "flex",
                flexDirection: "column",
                marginBottom: "0.400rem !important",
              }}
            >
              Identificadores dos Contêineres
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <InputCustom
                  title=""
                  typeInput="mask"
                  mask="aaaa-9999999"
                  placeholder="AAAA0000000"
                  onChange={(value: string) =>
                    setConteiners({
                      ...conteiners,
                      conteiners1: value,
                    })
                  }
                  value={conteiners.conteiners1}
                  disabled={props.isView}
                  isRequired={false}
                />
              </div>
              <div>
                <InputCustom
                  title=""
                  typeInput="mask"
                  mask="aaaa-9999999"
                  placeholder="AAAA0000000"
                  onChange={(value: string) =>
                    setConteiners({
                      ...conteiners,
                      conteiners2: value,
                    })
                  }
                  value={conteiners.conteiners2}
                  disabled={props.isView}
                  isRequired={false}
                />
              </div>
              <div>
                <InputCustom
                  title=""
                  typeInput="mask"
                  mask="aaaa-9999999"
                  placeholder="AAAA0000000"
                  onChange={(value: string) =>
                    setConteiners({
                      ...conteiners,
                      conteiners3: value,
                    })
                  }
                  value={conteiners.conteiners3}
                  disabled={props.isView}
                  isRequired={false}
                />
              </div>
              <div>
                <InputCustom
                  title=""
                  typeInput="mask"
                  mask="aaaa-9999999"
                  placeholder="AAAA0000000"
                  onChange={(value: string) =>
                    setConteiners({
                      ...conteiners,
                      conteiners4: value,
                    })
                  }
                  value={conteiners.conteiners4}
                  disabled={props.isView}
                  isRequired={false}
                />
              </div>
            </div>
          </div>
          <div>
            <InputCustom
              title="CNPJ Transportadora"
              typeInput="mask"
              mask="99.999.999/9999-99"
              placeholder=""
              onChange={formik.handleChange("cnpj_transportadora")}
              value={formik.values.cnpj_transportadora}
              touched={formik.touched.cnpj_transportadora}
              error={formik.errors.cnpj_transportadora}
              disabled={props.isView}
              isRequired={false}
            />
          </div>
        </div>
      </div>
      <div className="w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#F9FAFA] text-sm text-[#000000] font-bold rounded-full mr-2"
          style={{ border: "1px solid #DBDEDF" }}
          onClick={props.onClose}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          onClick={() => formik.handleSubmit()}
        >
          Salvar
        </button>
      </div>
    </>
  );
};

export default Form;
