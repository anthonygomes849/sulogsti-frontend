import React, { useCallback, useEffect, useState } from "react";
import api from "../../../../../../services/api";

import { useFormik } from "formik";
import { ToastContainer } from "react-toastify";
import InputCustom from "../../../../../../components/InputCustom";
import RadioGroupCustom from "../../../../../../components/RadioGroup";
import SelectCustom from "../../../../../../components/SelectCustom";
import Loading from "../../../../../../core/common/Loading";
import { FrontendNotification } from "../../../../../../shared/Notification";
import { IVeiculos } from "../../../types/types";
import formValidator from "../validators/formValidator";

interface FormValues {
  placa: string;
  id_estado: number | null;
  renavam: string;
  tipoParteVeiculo: boolean;
  rntrc: string;
  dataExpiracaoRNTRC: string;
  anoExercicioCRLV: number | null;
  livreAcessoPatio: boolean;
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IVeiculos;
  onConfirm: () => void;
  onClose: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (values: FormValues, row?: IVeiculos) => {
      try {
        setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        const body = {
          id_veiculo: row?.id_veiculo,
          placa: values.placa.replace("-", ""),
          id_estado: values.id_estado,
          renavam:
            String(values.renavam).replaceAll(".", "").replaceAll("-", "")
              .length > 0
              ? String(values.renavam).replaceAll(".", "").replaceAll("-", "")
              : null,
          tipo_parte_veiculo: values.tipoParteVeiculo,
          rntrc:
            values.rntrc !== null && values.rntrc.length > 0
              ? values.rntrc
              : null,
          data_expiracao_rntrc:
            values.dataExpiracaoRNTRC !== null &&
            values.dataExpiracaoRNTRC.length > 0
              ? values.dataExpiracaoRNTRC
              : null,
          ano_exercicio_crlv: values.anoExercicioCRLV,
          livre_acesso_patio: values.livreAcessoPatio,
          ativo: true,
          id_usuario_historico: userId,
          status: 1,
        };

        if (props.isEdit) {
          const response = await api.post("/editar/veiculos", body);

          if (response.status === 200) {
            props.onConfirm();
          } else {
            FrontendNotification("Erro ao salvar o veiculo!", "error");
          }
        } else {
          const response = await api.post("/cadastrar/veiculos", body);
          if (response.status === 200) {
            props.onConfirm();
          } else {
            FrontendNotification("Erro ao salvar o veiculo!", "error");
          }
        }

        setLoading(false);
      } catch {
        setLoading(false);
        FrontendNotification("Erro ao salvar o veiculo!", "error");
      }
    },
    []
  );

  const getStates = useCallback(async () => {
    try {
      const response = await api.post("/listar/estados");

      const mappingData = response.data.map((rows: any) => {
        return {
          value: rows.id_estado,
          label: rows.nome,
        };
      });

      setStates(mappingData);
    } catch {}
  }, []);

  const onLoadFormValues = useCallback((row: any) => {
    const data = row;

    if (data) {
      formik.setFieldValue("placa", data.placa);
      formik.setFieldValue("id_estado", data.id_estado);
      formik.setFieldValue("renavam", data.renavam);
      formik.setFieldValue("tipoParteVeiculo", data.tipo_parte_veiculo);
      formik.setFieldValue("rntrc", data.rntrc);
      formik.setFieldValue("dataExpiracaoRNTRC", data.data_expiracao_rntrc);
      formik.setFieldValue("anoExercicioCRLV", data.ano_exercicio_crlv);
      formik.setFieldValue("livreAcessoPatio", data.livre_acesso_patio);
      formik.setFieldValue("ativo", data.ativo);
    }
  }, []);

  const initialValues: FormValues = {
    placa: "",
    id_estado: null,
    renavam: "",
    tipoParteVeiculo: false,
    rntrc: "",
    dataExpiracaoRNTRC: "",
    anoExercicioCRLV: null,
    livreAcessoPatio: false,
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  useEffect(() => {
    getStates();
  }, [getStates]);

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <ToastContainer />
      <div className="grid grid-cols-2 gap-3 mb-4 p-5">
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
            data={states}
            onChange={(selectedOption: any) =>
              formik.setFieldValue("id_estado", selectedOption.value)
            }
            title="Estado"
            touched={formik.touched.id_estado}
            error={formik.errors.id_estado}
            disabled={props.isView}
            value={formik.values.id_estado}
          />
        </div>
        <div>
          <InputCustom
            title="Renavam"
            typeInput="mask"
            mask="99.99.99.99.99-9"
            placeholder="00.00.00.00.00-0"
            onChange={formik.handleChange("renavam")}
            touched={formik.touched.renavam}
            error={formik.errors.renavam}
            value={formik.values.renavam}
            disabled={props.isView}
          />
        </div>
        <div>
          <RadioGroupCustom
            title="Motorizado"
            onChange={(value: string) =>
              formik.setFieldValue("tipoParteVeiculo", value === "true")
            }
            value={formik.values.tipoParteVeiculo}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="RNTRC"
            placeholder=""
            onChange={formik.handleChange("rntrc")}
            touched={formik.touched.rntrc}
            error={formik.errors.rntrc}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="Expiração do RNTRC"
            type="date"
            placeholder=""
            onChange={formik.handleChange("dataExpiracaoRNTRC")}
            touched={formik.touched.dataExpiracaoRNTRC}
            error={formik.errors.dataExpiracaoRNTRC}
            value={formik.values.dataExpiracaoRNTRC}
            disabled={props.isView}
          />
        </div>
        <div>
          <InputCustom
            title="Ano Exercício CRLV"
            type="number"
            placeholder=""
            onChange={formik.handleChange("anoExercicioCRLV")}
            touched={formik.touched.anoExercicioCRLV}
            error={formik.errors.anoExercicioCRLV}
            value={formik.values.anoExercicioCRLV}
            disabled={props.isView}
          />
        </div>
        <div>
          <RadioGroupCustom
            title="Livre Acesso ao Pátio"
            onChange={(value: string) =>
              formik.setFieldValue("livreAcessoPatio", value === "true")
            }
            value={formik.values.livreAcessoPatio}
            disabled={props.isView}
          />
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
