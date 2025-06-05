import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../components/InputCustom/index.tsx";
import SelectCustom from "../../../../../components/SelectCustom/index.tsx";
import Loading from "../../../../../core/common/Loading/index.tsx";
import api from "../../../../../services/api.ts";
import { City, States } from "../../../Motoristas/Create/types/types.ts";
import {
  BillingPeriod,
  CargaType,
  IProprietarioCargas,
  Neighborhood, Options,
  PeriodPayment,
} from "../types/types.ts";
import formValidator from "./validators/formValidator.ts";
import {FrontendNotification} from "../../../../../shared/Notification/index.ts";
import {ToastContainer} from "react-toastify";

interface FormValues {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  periodo_faturamento: string;
  id_przpgto: string;
  endereco: string;
  id_estado: string;
  id_cidade: string;
  id_bairro: string;
  numero: string;
  complemento: string;
  cep: string;
  telefone: string;
  celular: string;
  contato: string;
  email: string;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IProprietarioCargas;
  onConfirm: () => void;
  onClose: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [states, setStates] = useState<Options[]>([]);
  const [cities, setCities] = useState<Options[]>([]);
  const [neighborhood, setNeighborhood] = useState<Options[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<Options[]>([]);
  const [periodPayment, setPeriodPayment] = useState<Options[]>([]);

  const [loading, setLoading] = useState<boolean>(false);


  const handleSubmit = useCallback(async (values: FormValues, row?: IProprietarioCargas) => {
      try {
        setLoading(true);


        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        const body = {
          id_proprietario_carga: row?.id_proprietario_carga,
          cnpj: values.cnpj.replaceAll(".", "").replaceAll("-", "").replace("/", ""),
          razao_social: values.razao_social,
          nome_fantasia: values.nome_fantasia,
          periodo_faturamento: values.periodo_faturamento.length > 0 ? Number(values.periodo_faturamento) + 1 : null,
          id_przpgto: values.id_przpgto.length > 0 ? Number(values.id_przpgto) : null,
          endereco: values.endereco,
          id_estado: values.id_estado !== null && values.id_estado.length > 0 ? Number(values.id_estado) : null,
          id_cidade: values.id_cidade !== null && values.id_cidade.length > 0 ? Number(values.id_cidade) : null,
          id_bairro: values.id_bairro !== null && values.id_bairro.length > 0 ? Number(values.id_bairro) : null,
          numero: values.numero.length > 0 ? Number(values.numero) : null,
          complemento: values.complemento !== null && values.complemento.length > 0 ? values.complemento : null,
          cep: values.cep !== null && values.cep.length > 0 ? values.cep.replace("-", "") : null,
          celular: values.celular !== null && values.celular.length > 0 ? values.celular.replace("(", "").replace(")", "").replace("-", "").replaceAll(" ", "") : null,
          telefone: values.telefone !== null && values.telefone.length > 0 ? values.telefone.replace("(", "").replace(")", "").replace("-", "").replaceAll(" ", "") : null,
          email: values.email,
          id_usuario_historico: Number(userId),
          ativo: true,
          status: 0
        }



        if(props.isEdit) {
            const response = await api.post("/editar/proprietariosCarga", body);

            if(response.status === 200) {
              FrontendNotification("Proprietario Cargas salvo com sucesso!", "success");
              props.onConfirm();
            } else {
              FrontendNotification("Erro ao salvar o Proprietario Cargas!", "error");
            }
        } else {
          const response = await api.post("/cadastrar/proprietariosCarga", body);

          if(response.status === 200) {
            FrontendNotification("Proprietario Cargas salvo com sucesso!", "success");
            props.onConfirm();
          } else {
            FrontendNotification("Erro ao salvar o Proprietario Cargas!", "error");
          }
        }

        setLoading(false);
      }catch{
        FrontendNotification("Erro ao salvar o terminal!", "error");
        setLoading(false);
      }
  }, [])

  const initialValues: FormValues = {
    cnpj: "",
    nome_fantasia: "",
    razao_social: "",
    periodo_faturamento: "",
    id_przpgto: "",
    endereco: "",
    id_estado: "",
    id_cidade: "",
    id_bairro: "",
    numero: "",
    complemento: "",
    cep: "",
    celular: "",
    telefone: "",
    email: "",
    contato: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      handleSubmit(values, props.selectedRow);
    },
  });

  const onLoadFormValues = useCallback((row?: IProprietarioCargas) => {
    const data = row;


    if (data) {
    console.log(data.periodo_faturamento - 1);
      formik.setFieldValue("cnpj", data.cnpj);
      formik.setFieldValue("razao_social", data.razao_social);
      formik.setFieldValue("nome_fantasia", data.nome_fantasia);
      formik.setFieldValue("periodo_faturamento", String(data.periodo_faturamento - 1));
      formik.setFieldValue("id_przpgto", data.id_przpgto);
      formik.setFieldValue("nomeFantasia", data.nome_fantasia);
      formik.setFieldValue("celular", data.celular);
      formik.setFieldValue("endereco", data.endereco);
      formik.setFieldValue("id_estado", String(data.id_estado));
      if(data.id_estado !== null) {
        getCities(data.id_estado);
      }
      formik.setFieldValue("id_cidade", String(data.id_cidade));
      if(data.id_cidade !== null) {
        getNeighborhood(data.id_cidade);
      }
      formik.setFieldValue("id_bairro",String(data.id_bairro));
      formik.setFieldValue("email", data.email);
      formik.setFieldValue("numero", data.numero);
      formik.setFieldValue("complemento", data.complemento);
      formik.setFieldValue("cep", data.cep);
      formik.setFieldValue("telefone", data.telefone);
      formik.setFieldValue("contato", data.contato);
      formik.setFieldValue("ativo", data.ativo);
    }
  }, []);

  const getStates = useCallback(async () => {
    try {
      const response = await api.post("/listar/estados", {});

      const mappingResponse = response.data.map((item: States) => {
        return {
          value: item.id_estado,
          label: item.nome,
        };
      });

      setStates(mappingResponse);
    } catch (error) {
      console.error("Failed to fetch states:", error);
    }
  }, []);

  const getCities = useCallback(
    async (id_estado: string) => {
      try {
        const body = {
          id_estado: id_estado,
        };

        const response = await api.post("/listar/cidades", body);

        const mappingResponse = response.data.map((item: City) => {
          return {
            value: item.id_cidade,
            label: item.nome,
          };
        });

        setCities(mappingResponse);
      } catch { /* empty */ }
    },
    [formik.values.id_estado]
  );

  const getNeighborhood = useCallback(
    async (id_cidade: string) => {
      try {
        const body = {
          id_cidade: id_cidade,
        };

        const response = await api.post("/listar/bairros", body);

        const mappingResponse = response.data.map((item: Neighborhood) => {
          return {
            value: item.id_bairro,
            label: item.nome,
          };
        });

        setNeighborhood(mappingResponse);
      } catch { /* empty */ }
    },
    [formik.values.id_cidade]
  );


  const getPeriodPayment = useCallback(async () => {
    try {
      const response = await api.post('/listar/faturasPrazoPagamento');

      if(response.status === 200) {

        
        const mappingResponse = response.data.map((item: PeriodPayment) => {
          return {
            label: item.descricao,
            value: item.id_przpgto,
          }
        });
        
        setPeriodPayment(mappingResponse);
        
      }
    }catch{ /* empty */ }
  }, [])

  const getBillingPeriod = useCallback(() => {
    const data: Options[] = Object.values(BillingPeriod).map(
      (value: string, index: number) => {
        return {
          value: index,
          label: value,
        };
      }
    );

    data.unshift({
      value: "",
      label: "Selecione"
    });

    setBillingPeriod(data);
  }, []);

  useEffect(() => {
    getStates();
  }, [getStates]);

  useEffect(() => {
    getBillingPeriod();
    getPeriodPayment();
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />

      <ToastContainer />
      <div className="overflow-y-scroll max-w-full max-h-[550px] p-5">
        <div className="grid grid-cols-2 gap-3 mb-2">
          <div>
            <InputCustom
              title="CNPJ"
              typeInput="mask"
              mask="99.999.999/9999-99"
              placeholder="000.000.000-00"
              onChange={formik.handleChange("cnpj")}
              value={formik.values.cnpj}
              touched={formik.touched.cnpj}
              error={formik.errors.cnpj}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Razão Social"
              placeholder=""
              onChange={formik.handleChange("razao_social")}
              value={formik.values.razao_social}
              touched={formik.touched.razao_social}
              error={formik.errors.razao_social}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Nome Fantasia"
              placeholder=""
              onChange={formik.handleChange("nome_fantasia")}
              value={formik.values.nome_fantasia}
              touched={formik.touched.nome_fantasia}
              error={formik.errors.nome_fantasia}
              disabled={props.isView}
            />
          </div>
          <div>
            <SelectCustom
              data={billingPeriod}
              onChange={(selectedOption: Options) => {
                formik.setFieldValue(
                  "periodo_faturamento",
                  String(selectedOption.value)
                );
              }}
              title="Período de Faturamento"
              touched={formik.touched.periodo_faturamento}
              error={formik.errors.periodo_faturamento}
              disabled={props.isView}
              value={formik.values.periodo_faturamento}
            />
          </div>
          <div>
          <SelectCustom
              data={periodPayment}
              onChange={(selectedOption: Options) => {
                formik.setFieldValue(
                  "id_przpgto",
                  String(selectedOption.value)
                );
              }}
              title="Prazo de Pagamento"
              touched={formik.touched.id_przpgto}
              error={formik.errors.id_przpgto}
              disabled={props.isView}
              value={formik.values.id_przpgto}
            />
            
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 mb-2">
          <div>
            <InputCustom
              title="Endereco"
              placeholder=""
              onChange={formik.handleChange("endereco")}
              value={formik.values.endereco}
              touched={formik.touched.endereco}
              error={formik.errors.endereco}
              disabled={props.isView}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <SelectCustom
              data={states}
              onChange={(selectedOption: Options) => {
                formik.setFieldValue("id_estado", String(selectedOption.value));
                getCities(String(selectedOption.value));
              }}
              title="Estado"
              touched={formik.touched.id_estado}
              error={formik.errors.id_estado}
              disabled={props.isView}
              value={formik.values.id_estado}
            />
          </div>
          <div>
            <SelectCustom
              data={cities}
              onChange={(selectedOption: Options) => {
                console.log(selectedOption);
                formik.setFieldValue("id_cidade", String(selectedOption.value));
                getNeighborhood(String(selectedOption.value));
              }}
              title="Cidade"
              touched={formik.touched.id_cidade}
              error={formik.errors.id_cidade}
              disabled={props.isView}
              value={formik.values.id_cidade}
            />
          </div>
          <div>
            <SelectCustom
              data={neighborhood}
              onChange={(selectedOption: Options) => {
                formik.setFieldValue("id_bairro", String(selectedOption.value));
              }}
              title="Bairro"
              touched={formik.touched.id_bairro}
              error={formik.errors.id_bairro}
              disabled={props.isView}
              value={formik.values.id_bairro}
            />
          </div>
          <div>
            <InputCustom
              title="Número"
              type="number"
              placeholder=""
              onChange={formik.handleChange("numero")}
              value={formik.values.numero}
              touched={formik.touched.numero}
              error={formik.errors.numero}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Complemento"
              placeholder=""
              onChange={formik.handleChange("complemento")}
              value={formik.values.complemento}
              touched={formik.touched.complemento}
              error={formik.errors.complemento}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="CEP"
              typeInput="mask"
              mask="99999-999"
              placeholder=""
              onChange={formik.handleChange("cep")}
              value={formik.values.cep}
              touched={formik.touched.cep}
              error={formik.errors.cep}
              disabled={props.isView}
            />
          </div>

          <div>
            <InputCustom
              title="E-mail"
              placeholder=""
              onChange={formik.handleChange("email")}
              value={formik.values.email}
              touched={formik.touched.email}
              error={formik.errors.email}
              disabled={props.isView}
            />
          </div>

          <div>
            <InputCustom
              title="Telefone"
              typeInput="mask"
              mask="(99) 9999-9999"
              placeholder=""
              onChange={formik.handleChange("telefone")}
              value={formik.values.telefone}
              touched={formik.touched.telefone}
              error={formik.errors.telefone}
              disabled={props.isView}
            />
          </div>

          <div>
            <InputCustom
              title="Celular"
              placeholder=""
              typeInput="mask"
              mask="(99) 99999-9999"
              onChange={formik.handleChange("celular")}
              value={formik.values.celular}
              touched={formik.touched.celular}
              error={formik.errors.celular}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Contato"
              placeholder=""
              onChange={formik.handleChange("contato")}
              value={formik.values.contato}
              touched={formik.touched.contato}
              error={formik.errors.contato}
              disabled={props.isView}
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
