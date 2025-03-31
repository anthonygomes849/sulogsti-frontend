import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { Label } from "reactstrap";
import InputCustom from "../../../../../components/InputCustom";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import api from "../../../../../services/api";
import { FrontendNotification } from "../../../../../shared/Notification";
import { TipoVeiculo } from "../../../../Cadastro/Veiculos/types/types";
import { IOperacoesPatioEntradaVeiculos } from "../types/types";
import formValidator from "../validators/formValidator";

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IOperacoesPatioEntradaVeiculos;
  onConfirm: () => void;
  onClose: () => void;
}

interface FormValues {
  data_hora: string;
  placa_dianteira: string;
  placa_traseira: string;
  numero_partes_nao_motorizada: string;
  identificadores_conteineres: string;
  id_operacao_patio_cancela: string;
  id_operacao_patio_cancela_saida: string;
  data_hora_saida: string;
}

const Form: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cancelasEntrada, setCancelasEntrada] = useState([]);
  const [cancelasSaida, setCancelasSaida] = useState([]);
  const [conteiners, setConteiners] = useState({
    conteiners1: "",
    conteiners2: "",
    conteiners3: "",
    conteiners4: "",
  });
  const [vehicleTypes, setVehicleTypes] = useState<any[]>([]);

  const onCreateTriagens = useCallback(async (idEntradaVeiculo: number) => {
    try {
      setLoading(true);
      const urlParams = new URLSearchParams(window.location.search);

      const userId = urlParams.get("userId");

      const body = {
        id_operacao_patio_entrada_veiculo: idEntradaVeiculo,
        status: 0,
        id_usuario_historico: userId,
        ativo: true,
      };

      const response = await api.post("/cadastrar/operacaoPatioTriagem", body);

      sessionStorage.setItem(
        "id_operacao_patio",
        response.data.id_operacao_patio
      );

      setLoading(false);

      return;
    } catch {}
  }, []);

  const handleSubmit = useCallback(
    async (
      values: FormValues,
      row?: IOperacoesPatioEntradaVeiculos,
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

        const body = {
          id_operacao_patio_entrada_veiculo:
            row?.id_operacao_patio_entrada_veiculo,
          data_hora: format(new Date(values.data_hora), "yyyy-MM-dd HH:mm:ss", {
            locale: ptBR,
          }),
          placa_dianteira: values.placa_dianteira.replace("-", ""),
          placa_traseira:
            values.placa_traseira.length > 0
              ? values.placa_traseira.replace("-", "")
              : null,
          numero_partes_nao_motorizada: values.numero_partes_nao_motorizada,
          identificadores_conteineres:
            getIndentificadorConteiner.length > 2 ? conteiners : null,
          id_operacao_patio_cancela: values.id_operacao_patio_cancela,
          id_operacao_patio_cancela_saida:
            values.id_operacao_patio_cancela_saida.length > 0
              ? values.id_operacao_patio_cancela_saida
              : null,
          data_hora_saida:
            values.data_hora_saida.length > 0 ? values.data_hora_saida : null,
          ativo: true,
          id_usuario_historico: userId,
          status: 1,
        };

        if (props.isEdit) {
          const response = await api.post("/editar/entradaSaidaVeiculos", body);

          if (response.status === 200) {
            props.onConfirm();
          } else {
            FrontendNotification("Erro ao salvar a entrada!", "error");
          }
        } else {
          const response = await api.post(
            "/cadastrar/entradaSaidaVeiculos",
            body
          );

          if (response.status === 200) {
            await onCreateTriagens(
              response.data.id_operacao_patio_entrada_veiculo
            );
            props.onConfirm();
          } else {
            FrontendNotification("Erro ao salvar a entrada!", "error");
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification("Erro ao salvar a entrada!", "error");

      }
    },
    []
  );

  const getCancelasEntradas = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.post("/listar/cancelasEntrada", {});

      if (response.status === 200) {
        const mappingResponse = response.data.map((item: any) => {
          return {
            label: `Cancela ${item.numero_cancela}`,
            value: item.id_operacao_patio_cancela,
          };
        });
        setCancelasEntrada(mappingResponse);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getCancelasSaida = useCallback(async () => {
    try {
      setLoading(true);

      const response = await api.post("/listar/cancelasSaida", {});

      if (response.status === 200) {
        const mappingResponse = response.data.map((item: any) => {
          return {
            label: `Cancela ${item.numero_cancela}`,
            value: item.id_operacao_patio_cancela,
          };
        });
        setCancelasSaida(mappingResponse);
      }

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getVehicleTypes = useCallback(() => {
      const data = Object.values(TipoVeiculo).map((value: any, index: number) => {
        return {
          value: `${index}`,
          label: value,
        };
      });
  
      setVehicleTypes(data);
    }, []);

  const onLoadFormValues = useCallback(
    (row?: IOperacoesPatioEntradaVeiculos) => {
      const data = row;

      if (data) {
        formik.setFieldValue("data_hora", data.data_hora);
        formik.setFieldValue("placa_dianteira", data.placa_dianteira);
        formik.setFieldValue("placa_traseira", data.placa_traseira);
        formik.setFieldValue(
          "numero_partes_nao_motorizada",
          data.numero_partes_nao_motorizada
        );
        formik.setFieldValue(
          "id_operacao_patio_cancela",
          data.id_operacao_patio_cancela
        );

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
        // formik.setFieldValue("id_operacao_patio_cancela_saida", data.id);
        // formik.setFieldValue("anoExercicioCRLV", data.ano_exercicio_crlv);
        // formik.setFieldValue("livreAcessoPatio", data.livre_acesso_patio);
        // formik.setFieldValue("ativo", data.ativo);
      }
    },
    []
  );

  const initialValues: FormValues = {
    data_hora: "",
    placa_dianteira: "",
    placa_traseira: "",
    numero_partes_nao_motorizada: "",
    identificadores_conteineres: "",
    id_operacao_patio_cancela: "",
    id_operacao_patio_cancela_saida: "",
    data_hora_saida: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) =>
      handleSubmit(values, props.selectedRow, conteiners),
  });

  useEffect(() => {
    getCancelasEntradas();
    getCancelasSaida();
    getVehicleTypes();
  }, [getCancelasEntradas, getCancelasSaida, getVehicleTypes]);

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <div className="overflow-y-scroll max-h-[calc(80vh-80px)] p-5">
        <div className="mb-3">
          <span className="text-sm font-bold">Entrada</span>
          <div className="w-full h-[1px] bg-[#ccc] mt-2" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <InputCustom
              title="Data Hora da Entrada"
              type="datetime-local"
              placeholder=""
              onChange={formik.handleChange("data_hora")}
              value={formik.values.data_hora}
              touched={formik.touched.data_hora}
              error={formik.errors.data_hora}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Placa Dianteira"
              placeholder="AAA-0000 OU AAA-0A00"
              typeInput="mask"
              mask="aaa-9*99"
              onChange={formik.handleChange("placa_dianteira")}
              value={formik.values.placa_dianteira}
              touched={formik.touched.placa_dianteira}
              error={formik.errors.placa_dianteira}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Placa Traseira"
              placeholder="AAA-0000 OU AAA-0A00"
              typeInput="mask"
              mask="aaa-9*99"
              onChange={formik.handleChange("placa_traseira")}
              value={formik.values.placa_traseira}
              touched={formik.touched.placa_traseira}
              error={formik.errors.placa_traseira}
              disabled={props.isView}
              isRequired={false}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div>
          <SelectCustom
              data={vehicleTypes}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("numero_partes_nao_motorizada", selectedOption.value);
              }}
              title="Tipo do Veículo"
              touched={formik.touched.numero_partes_nao_motorizada}
              error={formik.errors.numero_partes_nao_motorizada}
              disabled={props.isView}
              value={formik.values.numero_partes_nao_motorizada}
            />
          </div>
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
            <SelectCustom
              data={cancelasEntrada}
              onChange={(selectedOption: any) => {
                formik.setFieldValue(
                  "id_operacao_patio_cancela",
                  selectedOption.value
                );
              }}
              title="Cancela Entrada"
              touched={formik.touched.id_operacao_patio_cancela}
              error={formik.errors.id_operacao_patio_cancela}
              disabled={props.isView}
              value={formik.values.id_operacao_patio_cancela}
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1"></div>
        <div className="mb-4">
          <span className="text-sm font-bold">Saída</span>
          <div className="w-full h-[1px] bg-[#ccc] mt-2" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <SelectCustom
              data={cancelasSaida}
              onChange={(selectedOption: any) => {
                formik.setFieldValue(
                  "id_operacao_patio_cancela_saida",
                  selectedOption.value
                );
              }}
              title="Cancela Saída"
              touched={formik.touched.id_operacao_patio_cancela_saida}
              error={formik.errors.id_operacao_patio_cancela_saida}
              disabled={props.isView}
              value={formik.values.id_operacao_patio_cancela_saida}
            />
          </div>
          <div>
            <InputCustom
              title="Data Hora da Saída"
              type="date"
              placeholder=""
              onChange={formik.handleChange("data_hora_saida")}
              value={formik.values.data_hora_saida}
              touched={formik.touched.data_hora_saida}
              error={formik.errors.data_hora_saida}
              disabled={props.isView}
            />
          </div>
        </div>
      </div>
      <div className="sticky bottom-0 z-[999999999px] w-full h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
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
