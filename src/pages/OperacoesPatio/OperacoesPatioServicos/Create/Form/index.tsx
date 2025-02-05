import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import { formatDateTimeBR } from "../../../../../helpers/format";
import api from "../../../../../services/api";
import { IOperacoesPatioServicos } from "../../types/types";
import formValidator from "../validators/formValidator";

interface FormValues {
  id_operacao_patio_entrada_veiculo: string;
  id_tipo_servico: string;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IOperacoesPatioServicos;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [operacoesPatioEntradaVeiculos, setOperacoesPatioEntradaVeiculos] =
    useState<any[]>([]);
  const [tipoServico, setTipoServico] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (values: FormValues, row?: IOperacoesPatioServicos) => {
      try {
        setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        const body = {
          id_operacao_patio_servico: row?.id_operacao_patio_servico,
          id_operacao_patio_entrada_veiculo:
            values.id_operacao_patio_entrada_veiculo,
          id_tipo_servico: values.id_tipo_servico,
          ativo: true,
          id_usuario_historico: userId,
          status: 1,
        };

        if (props.isEdit) {
          await api.post("/editar/operacoesPatioServico", body);
        } else {
          await api.post("/associar/operacoesPatioServico", body);
        }

        setLoading(false);

        props.onConfirm();
      } catch {
        setLoading(false);
      }
    },
    []
  );

  const onLoadFormValues = useCallback((row: any) => {
    const data = row;

    if (data) {
      console.log(data);
      formik.setFieldValue("id_tipo_servico", data.id_tipo_servico);
      formik.setFieldValue(
        "id_operacao_patio_entrada_veiculo",
        String(data.id_operacao_patio_entrada_veiculo)
      );
    }
  }, []);

  const getOperacoesPatioEntradaVeiculo = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post("/listar/entradaSaidaVeiculos", body);

      console.log(response.data.data);

      const mappingData = response.data.data.map((rows: any) => {
        return {
          id: rows.id_operacao_patio_entrada_veiculo,
          label: `${rows.placa_dianteira} | ${formatDateTimeBR(rows.data_hora)}`,
        };
      });

      setOperacoesPatioEntradaVeiculos(mappingData);

      setLoading(false);
    } catch {}
  }, []);

  const getTipoServico = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post("/listar/tipoServicos", body);

      console.log(response.data.data);

      const mappingData = response.data.data.map((rows: any) => {
        return {
          id: rows.id_tipo_servico,
          label: rows.tipo_servico,
        };
      });

      setTipoServico(mappingData);

      setLoading(false);
    } catch {}
  }, []);

  const initialValues: FormValues = {
    id_operacao_patio_entrada_veiculo: "",
    id_tipo_servico: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  useEffect(() => {
    getOperacoesPatioEntradaVeiculo();
    getTipoServico();
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, [getOperacoesPatioEntradaVeiculo, getTipoServico]);


  return (
    <>
      <Loading loading={loading} />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
        <SelectCustom
            title="Tipo Serviço"
            data={tipoServico}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("id_tipo_servico", selectedOption.id)
            }
            touched={formik.touched.id_tipo_servico}
            error={formik.errors.id_tipo_servico}
            value={formik.values.id_tipo_servico}
            disabled={props.isView}
          />
        </div>
        <div>
          <SelectCustom
            title="Entrada Veiculo"
            data={operacoesPatioEntradaVeiculos}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("id_operacao_patio_entrada_veiculo", selectedOption.id)
            }
            touched={formik.touched.id_operacao_patio_entrada_veiculo}
            error={formik.errors.id_operacao_patio_entrada_veiculo}
            value={formik.values.id_operacao_patio_entrada_veiculo}
            disabled={props.isView}
          />
        </div>
      </div>

      {!props.isView && (
        <div className="flex items-center mt-6">
          <button
            type="button"
            className="w-full h-10 bg-[#003459] text-sm text-[#fff] rounded-md mr-2"
            onClick={() => formik.handleSubmit()}
          >
            Salvar
          </button>
          <button
            type="button"
            className="w-full h-10 bg-[#9D9FA1] text-sm text-[#fff] rounded-md"
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
