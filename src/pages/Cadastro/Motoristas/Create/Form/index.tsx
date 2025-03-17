import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import InputCustom from "../../../../../components/InputCustom";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import { validateCPF } from "../../../../../helpers/format";
import api from "../../../../../services/api";
import { FrontendNotification } from "../../../../../shared/Notification";
import {
  CategoriaCNH,
  City,
  IMotorista,
  Neighborhood,
  States,
} from "../types/types";
import formValidator from "../validators/formValidator";

// import { Container } from './styles';

interface FormValues {
  cpf: string;
  nome: string;
  numero_cnh: string;
  categoria_cnh: string;
  data_expiracao_cnh: string;
  endereco: string;
  id_estado: string;
  id_cidade: string;
  id_bairro: string;
  numero: string;
  complemento: string;
  cep: string;
  celular: string;
  email: string;
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IMotorista;
  onConfirm: () => void;
  onClose: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [categoryCNH, setCategoryCNH] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhood, setNeighborhood] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = useCallback(
    async (values: FormValues, row?: IMotorista) => {
      try {
        setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);

        const userId = urlParams.get("userId");

        const body = {
          id_motorista: row?.id_motorista,
          cpf: values.cpf.replaceAll('.', '').replace('-', ''),
          nome: values.nome,
          endereco: values.endereco.length > 0 ? values.endereco : null,
          complemento:
            values.complemento.length > 0 ? values.complemento : null,
          numero: values.numero ? Number(values.numero) : null,
          cep: values.cep.length > 0 ? values.cep : null,
          id_bairro: values.id_bairro ? values.id_bairro : null,
          id_cidade: values.id_cidade ? values.id_cidade : null,
          id_estado: String(values.id_estado).length > 0 ? Number(values.id_estado) : null,
          celular: values.celular.replaceAll('(', '').replaceAll(')', '').replace(' ', '').replace('-', ''),
          numero_cnh: values.numero_cnh.replaceAll('.', '').replace('-', ''),
          categoria_cnh: values.categoria_cnh,
          data_expiracao_cnh: values.data_expiracao_cnh,
          ativo: true,
          tipo_parte_veiculo: true,
          status: 1,
          id_usuario_historico: Number(userId),
        };

        if(validateCPF(values.cpf)) {


        if (props.isEdit) {
          const response = await api.post("/editar/motoristas", body);

          if(response.status === 200) {
            FrontendNotification('Motorista salvo com sucesso!', 'success');
            props.onConfirm();
          } else {
            FrontendNotification('Erro ao salvar o motorista!', 'error');
          }
        } else {
          const response = await api.post("/cadastrar/motoristas", body);
          if(response.status === 200) {
            FrontendNotification('Motorista salvo com sucesso!', 'success');
            props.onConfirm();
          } else {
            FrontendNotification('Erro ao salvar o motorista!', 'error');
          }
        }

      } else {
        FrontendNotification('CPF inválido', 'error');
      }


        setLoading(false);

      } catch {
        setLoading(false);
        FrontendNotification('Erro ao salvar o motorista!', 'error');
      }
    },
    []
  );

  const initialValues: FormValues = {
    cpf: "",
    nome: "",
    numero_cnh: "",
    categoria_cnh: "",
    data_expiracao_cnh: "",
    endereco: "",
    id_estado: "",
    id_cidade: "",
    id_bairro: "",
    numero: "",
    complemento: "",
    cep: "",
    celular: "",
    email: "",
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  const onLoadFormValues = useCallback((row?: IMotorista) => {
    const data = row;

    if (data) {
      formik.setFieldValue("cpf", data.cpf);
      formik.setFieldValue("nome", data.nome);
      formik.setFieldValue("numero_cnh", data.numero_cnh);
      formik.setFieldValue("categoria_cnh", data.categoria_cnh);
      formik.setFieldValue("data_expiracao_cnh", data.data_expiracao_cnh);
      formik.setFieldValue("celular", data.celular);
      formik.setFieldValue("endereco", data.endereco);
      formik.setFieldValue("id_estado", data.id_estado);
      getCities(data.id_estado);
      getNeighborhood(data.id_cidade);
      formik.setFieldValue("id_cidade", data.id_cidade);
      formik.setFieldValue("numero", data.numero);
      formik.setFieldValue("cep", data.cep);
      formik.setFieldValue("ativo", data.ativo);
    }
  }, []);

  const onLoadCategoryCNH = useCallback(() => {
    const mappingCategory = Object.values(CategoriaCNH).map((category: any) => {
      return {
        id: category,
        label: category,
      };
    });

    setCategoryCNH(mappingCategory);
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
    } catch {}
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

        formik.setFieldValue("id_cidade", props.selectedRow?.id_cidade);

      } catch {}
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

        formik.setFieldValue("id_bairro", props.selectedRow?.id_bairro);
      } catch {}
    },
    [formik.values.id_cidade]
  );

  useEffect(() => {
    onLoadCategoryCNH();
  }, [onLoadCategoryCNH]);

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
      <div className="overflow-y-scroll max-w-full max-h-[550px] p-5">
        <div className="grid grid-cols-3 gap-3 mb-2">
          <div>
            <InputCustom
              title="CPF"
              typeInput="mask"
              mask="999.999.999-99"
              placeholder="000.000.000-00"
              onChange={formik.handleChange("cpf")}
              value={formik.values.cpf}
              touched={formik.touched.cpf}
              error={formik.errors.cpf}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Nome"
              placeholder="Informe o nome do motorista"
              onChange={formik.handleChange("nome")}
              value={formik.values.nome}
              touched={formik.touched.nome}
              error={formik.errors.nome}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Número CNH"
              typeInput="mask"
              mask="999.999.999-99"
              placeholder="000.000.000-00"
              onChange={formik.handleChange("numero_cnh")}
              value={formik.values.numero_cnh}
              touched={formik.touched.numero_cnh}
              error={formik.errors.numero_cnh}
              disabled={props.isView}
            />
          </div>
          <div>
            <SelectCustom
              data={categoryCNH}
              onChange={(selectedOption: any) =>
                formik.setFieldValue("categoria_cnh", selectedOption.id)
              }
              title="Categoria CNH"
              touched={formik.touched.categoria_cnh}
              error={formik.errors.categoria_cnh}
              disabled={props.isView}
              value={formik.values.categoria_cnh}
            />
          </div>
          <div>
            <InputCustom
              title="Data de Expiração da CNH"
              type="date"
              placeholder=""
              onChange={formik.handleChange("data_expiracao_cnh")}
              value={formik.values.data_expiracao_cnh}
              touched={formik.touched.data_expiracao_cnh}
              error={formik.errors.data_expiracao_cnh}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Celular"
              typeInput="mask"
              mask="(99) 99999-9999"
              placeholder="(00) 00000-0000"
              onChange={formik.handleChange("celular")}
              value={formik.values.celular}
              touched={formik.touched.celular}
              error={formik.errors.celular}
              disabled={props.isView}
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
        <div className="grid grid-cols-3 gap-3">
          <div>
            <SelectCustom
              data={states}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("id_estado", selectedOption.value);
                getCities(selectedOption.value);
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
              onChange={(selectedOption: any) => {
                formik.setFieldValue("id_cidade", selectedOption.value);
                getNeighborhood(selectedOption.value);
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
              onChange={(selectedOption: any) => {
                formik.setFieldValue("id_bairro", selectedOption.value);
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
