import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../../components/InputCustom";
import SelectCustom from "../../../../../../components/SelectCustom";
import api from "../../../../../../services/api";
import { CategoriaCNH, City, IMotorista, Neighborhood, States } from "../types/types";

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
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IMotorista;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [categoryCNH, setCategoryCNH] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhood, setNeighborhood] = useState<any[]>([]);

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
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    onSubmit: () => {},
  });

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
          id: item.id_estado,
          label: item.nome,
        };
      });

      setStates(mappingResponse);
    } catch {}
  }, []);

  const getCities = useCallback(async (id_estado: string) => {
    try {
      const body = {
        id_estado: id_estado
      };

      const response = await api.post("/listar/cidades", body);

      const mappingResponse = response.data.map((item: City) => {
        return {
          id: item.id_cidade,
          label: item.nome,
        };
      });

      setCities(mappingResponse);
    } catch {}
  }, [formik.values.id_estado]);

  const getNeighborhood = useCallback(async (id_cidade: string) => {
    try {
      const body = {
        id_cidade: id_cidade
      };

      const response = await api.post("/listar/bairros", body);

      const mappingResponse = response.data.map((item: Neighborhood) => {
        return {
          id: item.id_bairro,
          label: item.nome,
        };
      });

      setNeighborhood(mappingResponse);
    } catch {}
  }, [formik.values.id_cidade]);

  

  useEffect(() => {
    onLoadCategoryCNH();
  }, [onLoadCategoryCNH]);

  useEffect(() => {
    getStates();
  }, [getStates]);


  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-2">
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <SelectCustom
            data={states}
            onChange={(selectedOption: any) => {

              formik.setFieldValue("id_estado", selectedOption.id)
              getCities(selectedOption.id);
            }
            }
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

              formik.setFieldValue("id_cidade", selectedOption.id)
              getNeighborhood(selectedOption.id);
            }
            }
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
              formik.setFieldValue("id_bairro", selectedOption.id)
            }
            }
            title="Cidade"
            touched={formik.touched.id_bairro}
            error={formik.errors.id_bairro}
            disabled={props.isView}
            value={formik.values.id_bairro}
          />
        </div>
        <div>
          <InputCustom
            title="Número"
            placeholder=""
            onChange={formik.handleChange("endereco")}
            value={formik.values.endereco}
            touched={formik.touched.endereco}
            error={formik.errors.endereco}
            disabled={props.isView}
          />
        </div>
      </div>
    </>
  );
};

export default Form;
