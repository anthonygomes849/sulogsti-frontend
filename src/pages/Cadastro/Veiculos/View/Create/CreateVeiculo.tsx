import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../components/InputCustom";
import RadioGroupCustom from "../../../../../components/RadioGroup";
import SelectCustom from "../../../../../components/SelectCustom";
import api from "../../../../../services/api";

import { useFormik } from 'formik';
import history from "../../../../../services/history";
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

  const getStates = useCallback(async () => {
    try {
      const response = await api.post("/listar/estados");

      const mappingData = response.data.map((rows: any) => {
        return {
          id: rows.id_estado,
          label: rows.nome
        }
      })

      setStates(mappingData);

      console.log(response.data);
    } catch {}
  }, []);

  const initialValues: FormValues  = {
    placa: '',
    id_estado: null,
    renavam: '',
    tipoParteVeiculo: false,
    rntrc: '',
    dataExpiracaoRNTRC: '',
    anoExercicioCRLV: null,
    livreAcessoPatio: false,
    ativo: true
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      console.log(values);
    }
  })
  useEffect(() => {
    getStates();
  }, [getStates]);

  return (
    <div className="!w-full h-full flex flex-col !pt-16 !pr-16 !pl-16 !pb-16 !mb-48">
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
              onChange={formik.handleChange('placa')}
              touched={formik.touched.placa}
              error={formik.errors.placa}
            />
          </div>
          <div className="!mt-4 w-full">
            <SelectCustom data={states} onChange={() => {}} title="Estado" />
          </div>
          <div className="flex items-center !mt-6 w-full">
            <div className="flex flex-col w-[80%]">
              <InputCustom
                title="Renavam"
                typeInput="mask"
                mask="99.99.99.99.99-9"
                placeholder="00.00.00.00.00-0"
                onChange={() => {}}
              />
            </div>
            <button className="bg-[#e9ecef] w-28 h-10 !mt-9 text-[#666] border-[#ced4da] rounded-[2px] hover:bg-[#edb20e] hover:text-[#fff]">
              Coletar
            </button>
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
            <RadioGroupCustom title="Motorizado" onChange={() => {}} />
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
            <InputCustom title="RNTRC" placeholder="" onChange={formik.handleChange('rntrc')} touched={formik.touched.rntrc} error={formik.errors.rntrc} />
          </div>
          <div className="flex items-center !mt-6 w-full">
            <div className="flex flex-col w-full">
              <InputCustom
                title="Expiração do RNTRC"
                type="date"
                placeholder=""
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="!mt-6 w-full">
            <InputCustom
              title="Ano Exercício CRLV"
              type="number"
              placeholder=""
              onChange={() => {}}
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
            <RadioGroupCustom title="Livre Acesso ao Pátio" onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="flex items-start justify-start w-3/4 mt-11">
        <div className="w-[300px] min-w-[300px] flex flex-col items-start justify-start">
          <h1 className="text-sm font-bold text-[#333]">Situação</h1>
          <span className="text-xs font-bold text-[#999] text-left">
            Situação do veículo que pode estar ativo ou <br /> pode ser inativado por
            motivos operacionais, financeiros, etc.
          </span>
        </div>
        <div className="flex flex-col w-full">
          <div className="!mt-2 w-full">
            <RadioGroupCustom title="Ativo" onChange={() => {}} />
          </div>
        </div>
      </div>

      <div className="w-full h-full flex items-center justify-end mt-11 !mb-24">
        <button className="bg-[#005491] w-24 h-10 text-[#fff] rounded-md mr-4" type="button" onClick={() => formik.handleSubmit()}>
          Salvar
        </button>
        <button className="bg-[#e9ecef] w-24 h-10 text-[#666] rounded-md" onClick={() => {
          history.push(window.location.pathname.replace('/adicionar', ''));

          window.location.reload();
        }}>
          Cancelar
        </button>
      </div>

      <div className="mb-28" />
    </div>
  );
};

export default CreateVeiculos;
