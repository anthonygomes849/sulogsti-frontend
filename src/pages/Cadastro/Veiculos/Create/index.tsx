import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../components/InputCustom";
import RadioGroupCustom from "../../../../components/RadioGroup";
import SelectCustom from "../../../../components/SelectCustom";
import api from "../../../../services/api";

import { useFormik } from "formik";
import Loading from "../../../../core/common/Loading";
import history from "../../../../services/history";
import formValidator from "./validators/formValidator";

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

const CreateVeiculos: React.FC = () => {
  const [states, setStates] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(async (values: FormValues) => {
    try {
      setLoading(true);

      const body = {
        placa: values.placa,
        id_estado: values.id_estado,
        renavam: values.renavam,
        tipo_parte_veiculo: values.tipoParteVeiculo,
        rntrc: values.rntrc,
        data_expiracao_rntrc: values.dataExpiracaoRNTRC,
        ano_exercicio_crlv: values.anoExercicioCRLV,
        livre_acesso_patio: values.livreAcessoPatio,
        ativo: values.ativo,
      };

      await api.post("/cadastrar/veiculos", body);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const getStates = useCallback(async () => {
    try {
      const response = await api.post("/listar/estados");

      const mappingData = response.data.map((rows: any) => {
        return {
          id: rows.id_estado,
          label: rows.nome,
        };
      });

      setStates(mappingData);

      console.log(response.data);
    } catch {}
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
    onSubmit: (values: FormValues) => handleSubmit(values),
  });

  useEffect(() => {
    getStates();
  }, [getStates]);

  return (
    <div className="!w-full h-full flex flex-col !pt-16 !pr-16 !pl-16 !pb-16 !mb-48">
      <Loading loading={loading} />
      <div className="flex items-start justify-start w-3/4 mb-11">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Identificação</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Identificação do veículo utilizado para as operações do pátio
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-4 w-full">
            <InputCustom
              title="Placa"
              placeholder="AAA-0000 OU AAA-0A00"
              onChange={formik.handleChange("placa")}
              touched={formik.touched.placa}
              error={formik.errors.placa}
              value={formik.values.placa}
            />
          </div>
          <div className="!mt-4 w-full">
            <SelectCustom
              data={states}
              onChange={(selectedOption: any) =>
                formik.setFieldValue("id_estado", selectedOption.id)
              }
              title="Estado"
              touched={formik.touched.id_estado}
              error={formik.errors.id_estado}
            />
          </div>
          <div className="flex items-center justify-center !mt-6 w-full">
            <div className="flex flex-col w-full">
              <InputCustom
                title="Renavam"
                typeInput="mask"
                mask="99.99.99.99.99-9"
                placeholder="00.00.00.00.00-0"
                onChange={formik.handleChange("renavam")}
                touched={formik.touched.renavam}
                error={formik.errors.renavam}
                value={formik.values.renavam}
              />
            </div>
            <div className="flex">
              <button
                className={`bg-[#e9ecef] w-28 h-10 ${
                  formik.touched.renavam && formik.errors.renavam
                    ? "!mt-4"
                    : "!mt-9"
                } text-[#666] border-[#ced4da] rounded-[2px] hover:bg-[#edb20e] hover:text-[#fff]`}
              >
                Coletar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-start w-3/4">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Classificação</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Classificação do veículo utilizado para as operações do pátio
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-2 w-full">
            <RadioGroupCustom
              title="Motorizado"
              onChange={(value: string) =>
                formik.setFieldValue("tipoParteVeiculo", value === "true")
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start w-3/4 mt-16">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Licenciamento</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Licenciamento do veículo autorizado pelos órgãos e agências
            governamentais
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-4 w-full">
            <InputCustom
              title="RNTRC"
              placeholder=""
              onChange={formik.handleChange("rntrc")}
              touched={formik.touched.rntrc}
              error={formik.errors.rntrc}
            />
          </div>
          <div className="flex items-center !mt-6 w-full">
            <div className="flex flex-col w-full">
              <InputCustom
                title="Expiração do RNTRC"
                type="date"
                placeholder=""
                onChange={formik.handleChange("dataExpiracaoRNTRC")}
                touched={formik.touched.dataExpiracaoRNTRC}
                error={formik.errors.dataExpiracaoRNTRC}
                value={formik.values.dataExpiracaoRNTRC}
              />
            </div>
          </div>

          <div className="!mt-6 w-full">
            <InputCustom
              title="Ano Exercício CRLV"
              type="number"
              placeholder=""
              onChange={formik.handleChange("anoExercicioCRLV")}
              touched={formik.touched.anoExercicioCRLV}
              error={formik.errors.anoExercicioCRLV}
              value={formik.values.anoExercicioCRLV}
            />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start w-3/4 mt-11">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Acesso</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Acesso do veículo utilizado para as operações <br /> do pátio
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-2 w-full">
            <RadioGroupCustom
              title="Livre Acesso ao Pátio"
              onChange={(value: string) =>
                formik.setFieldValue("livreAcessoPatio", value === "true")
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start w-3/4 mt-11">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Situação</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Situação do veículo que pode estar ativo ou <br /> pode ser
            inativado por motivos operacionais, financeiros, etc.
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-2 w-full">
            <RadioGroupCustom
              title="Ativo"
              onChange={(value: string) =>
                formik.setFieldValue("ativo", value === "true")
              }
            />
          </div>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-end mt-11 !mb-24">
        <button
          className="bg-[#005491] w-24 h-10 text-[#fff] rounded-md mr-4"
          type="button"
          onClick={() => formik.handleSubmit()}
        >
          Salvar
        </button>
        <button
          className="bg-[#e9ecef] w-24 h-10 text-[#666] rounded-md"
          onClick={() => {
            history.push(window.location.pathname.replace("/adicionar", ""));

            window.location.reload();
          }}
        >
          Cancelar
        </button>
      </div>

      <div className="mb-28" />
    </div>
  );
};

export default CreateVeiculos;
