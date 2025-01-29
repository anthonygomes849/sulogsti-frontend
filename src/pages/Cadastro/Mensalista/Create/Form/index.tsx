import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../components/InputCustom";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import api from "../../../../../services/api";
import { IMensalista } from "../../types/types";
import formValidator from "../validators/formValidator";

interface FormValues {
  placa: string;
  id_transportadora: string;
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IMensalista;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [transportadoras, setTransportadoras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getTransportadoras = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post("/listar/transportadoras", body);

      console.log(response.data.data);

      const mappingData = response.data.data.map((rows: any) => {
        return {
          id: rows.id_transportadora,
          label: rows.razao_social,
        };
      });

      setTransportadoras(mappingData);

      setLoading(false);
    } catch {}
  }, []);

  const handleSubmit = useCallback(
    async (values: FormValues, row?: IMensalista) => {
      try {
        setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        const body = {
          id_mensalista: row?.id_mensalista,
          placa: values.placa.replace("-", ""),
          id_transportadora: values.id_transportadora,
          ativo: true,
          id_usuario_historico: userId,
          status: 1,
        };

        if (props.isEdit) {
          await api.post("/editar/mensalistas", body);
        } else {
          await api.post("/cadastrar/mensalistas", body);
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

    if(data) {
      formik.setFieldValue('placa', data.placa);
      formik.setFieldValue('id_transportadora', data.mensalista_transportadora.id_transportadora);
      formik.setFieldValue('ativo', data.ativo);
    }
  }, [])

  const initialValues: FormValues = {
    placa: "",
    id_transportadora: "",
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  useEffect(() => {
    getTransportadoras();
  }, [getTransportadoras]);

  useEffect(() => {
    if(props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, [])

  return (
    <>
      <Loading loading={loading} />
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <InputCustom
            title="Placa"
            typeInput="mask"
            mask="aaa-9*99"
            placeholder="AAA-0000 OU AAA-0A00"
            onChange={formik.handleChange("placa")}
            touched={formik.touched.placa}
            error={formik.errors.placa}
            value={formik.values.placa}
            disabled={props.isView}
          />
        </div>
        <div>
          <SelectCustom
            title="Transportadora"
            data={transportadoras}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("id_transportadora", selectedOption.id)
            }
            touched={formik.touched.id_transportadora}
            error={formik.errors.id_transportadora}
            value={formik.values.id_transportadora}
            disabled={props.isView}
          />
        </div>
      </div>

      {!props.isView && (
        <div className="flex items-center mt-6">
          <button
            type="button"
            className="w-full h-10 bg-[#003459] text-base text-[#fff] rounded-md mr-2"
            onClick={() => formik.handleSubmit()}
          >
            Salvar
          </button>
          <button
            type="button"
            className="w-full h-10 bg-[#9D9FA1] text-base text-[#fff] rounded-md"
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
