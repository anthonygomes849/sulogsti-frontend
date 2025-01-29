import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../components/InputCustom";
import Loading from "../../../../../core/common/Loading";
import api from "../../../../../services/api";
import { ITipoServico } from "../types/types";
import formValidator from "../validators/formValidator";

interface FormValues {
  tipo_servico: string;
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: ITipoServico;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (values: FormValues, row?: ITipoServico) => {
    try {
      setLoading(true);
      
      const urlParams = new URLSearchParams(window.location.search);

      const userId = urlParams.get("userId");

      const body = {
        id_tipo_servico: row?.id_tipo_servico,
        tipo_servico: values.tipo_servico,
        ativo: true,
        id_usuario_historico: userId,
        status: 1,
      };

      if (props.isEdit) {
        await api.post("/editar/tipoServicos", body);
      } else {
        await api.post("/cadastrar/tipoServicos", body);
      }

      setLoading(false);

      props.onConfirm();
    } catch {
      setLoading(false);
    }
  }, []);

  const onLoadFormValues = useCallback((row: any) => {
    const data = row;

    if (data) {
      formik.setFieldValue("tipo_servico", data.tipo_servico);
      formik.setFieldValue("ativo", data.ativo);
    }
  }, []);


  const initialValues: FormValues = {
    tipo_servico: "",
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <div className="grid grid-cols-1 gap-3 mb-4">
        <div>
          <InputCustom
            title="Tipo do Serviço"
            placeholder="Informe o tipo do serviço"
            onChange={formik.handleChange("tipo_servico")}
            touched={formik.touched.tipo_servico}
            error={formik.errors.tipo_servico}
            value={formik.values.tipo_servico}
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
