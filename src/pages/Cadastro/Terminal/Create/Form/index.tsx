import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import InputCustom from "../../../../../components/InputCustom";
import RadioGroupCustom from "../../../../../components/RadioGroup";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import api from "../../../../../services/api";
import { City, States } from "../../../Motoristas/Create/types/types";
import { BillingPeriod, CargaType, ITerminal, Neighborhood } from "../types/types";

interface FormValues {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  tipos_carga: string;
  periodo_faturamento: number;
  id_przpgto: number;
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
  ativo: boolean;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: ITerminal;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [neighborhood, setNeighborhood] = useState<any[]>([]);
  const [cargoTypes, setCargoTypes] = useState<any[]>([]);
  const [billingPeriod, setBillingPeriod] = useState<any[]>([]);
  const [valueCargoTypes, setValueCargoTypes] = useState<any[]>([]);
  const [loading] = useState<boolean>(false);

  // const handleSubmit = useCallback(
  //   async (values: FormValues, row?: IMotorista) => {
  //     try {
  //       setLoading(true);

  //       const body = {
  //         id_motorista: row?.id_terminal,
  //         cpf: values.cpf,
  //         nome: values.nome,
  //         endereco: values.endereco.length > 0 ? values.endereco : null,
  //         complemento:
  //           values.complemento.length > 0 ? values.complemento : null,
  //         numero: values.numero.length > 0 ? values.numero : null,
  //         cep: values.cep.length > 0 ? values.cep : null,
  //         id_bairro: values.id_bairro.length > 0 ? values.id_bairro : null,
  //         id_cidade: values.id_cidade.length > 0 ? values.id_cidade : null,
  //         id_estado: values.id_estado,
  //         celular: values.celular,
  //         numero_cnh: values.numero_cnh,
  //         categoria_cnh: values.categoria_cnh,
  //         data_expiracao_cnh: values.data_expiracao_cnh,
  //         ativo: values.ativo,
  //         tipo_parte_veiculo: true,
  //         data_inativacao: null,
  //         motivo_inativacao: null,
  //         dias_inativacao: null,
  //         id_piramide: null,
  //         status: 1,
  //         id_usuario_historico: 1,
  //       };

  //       if(props.isEdit) {
  //         await api.post("/editar/terminais", body);
  //       } else {
  //         await api.post('/cadastrar/terminais', body);
  //       }

  //       setLoading(false);

  //       props.onConfirm();
  //     } catch {
  //       setLoading(false);
  //     }
  //   },
  //   []
  // );

  const initialValues: FormValues = {
    cnpj: "",
    nomeFantasia: "",
    razaoSocial: "",
    periodo_faturamento: 0,
    id_przpgto: 0,
    tipos_carga: "",
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
    ativo: true,
  };

  const formik = useFormik({
    initialValues,
    // validationSchema: formValidator,
    onSubmit: (values: FormValues) => {
      console.log(values);
    },
  });

  const onLoadFormValues = useCallback((row?: ITerminal) => {
    const data = row;


    if (data) {
      formik.setFieldValue("cnpj", data.cnpj);
      formik.setFieldValue("razaoSocial", data.razao_social);
      formik.setFieldValue("nomeFantasia", data.nome_fantasia);
      formik.setFieldValue("periodo_faturamento", data.periodo_faturamento);
      formik.setFieldValue("id_przpgto", data.id_przpgto);
      if(data.tipos_carga) {
        console.log(data.tipos_carga.split(','));
        const cargaType: any[] = data.tipos_carga.replace("{", "").replace("}", "").split(",");

        const getCargoType = cargaType.map((item: any) => {
          return {
            value: item,
            label: Object.values(CargaType)[Number(item - 1)]
          }
        });

        setValueCargoTypes(getCargoType);
        formik.setFieldValue("tipos_carga", data.tipos_carga);
      }
      formik.setFieldValue("nomeFantasia", data.nome_fantasia);
      formik.setFieldValue("celular", data.celular);
      formik.setFieldValue("endereco", data.endereco);
      formik.setFieldValue("id_estado", data.id_estado);
      formik.setFieldValue("id_bairro", data.id_bairro);
      formik.setFieldValue("id_cidade", data.id_cidade);
      formik.setFieldValue("numero", data.numero);
      formik.setFieldValue("cep", data.cep);
      formik.setFieldValue("ativo", data.ativo);
    }
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

  const getCities = useCallback(
    async (id_estado: string) => {
      try {
        const body = {
          id_estado: id_estado,
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
            id: item.id_bairro,
            label: item.nome,
          };
        });

        setNeighborhood(mappingResponse);
      } catch {}
    },
    [formik.values.id_cidade]
  );

  const getCargoTypes = useCallback(() => {
    const data = Object.values(CargaType).map((value: any, index: number) => {
      return {
        value: `${index + 1}`,
        label: value,
      };
    });

    setCargoTypes(data);
  }, []);

  const getBillingPeriod = useCallback(() => {
    const data = Object.values(BillingPeriod).map((value: any, index: number) => {
      return {
        value: index + 1,
        label: value,
      };
    });

    setBillingPeriod(data);
  }, []);

  useEffect(() => {
    getStates();
  }, [getStates]);
  
  useEffect(() => {
    getCargoTypes();
    getBillingPeriod();
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <div className="overflow-y-scroll max-h-[550px]">
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
              onChange={formik.handleChange("razaoSocial")}
              value={formik.values.razaoSocial}
              touched={formik.touched.razaoSocial}
              error={formik.errors.razaoSocial}
              disabled={props.isView}
            />
          </div>
          <div>
            <InputCustom
              title="Nome Fantasia"
              placeholder=""
              onChange={formik.handleChange("nomeFantasia")}
              value={formik.values.nomeFantasia}
              touched={formik.touched.nomeFantasia}
              error={formik.errors.nomeFantasia}
              disabled={props.isView}
            />
          </div>
          <div>
            <SelectCustom
              data={cargoTypes}
              isMulti
              onChange={(selectedOption: any) => {
               setValueCargoTypes(selectedOption);

               let dataCargoTypes = "{";

                selectedOption.map((item: any) => {
                  dataCargoTypes = dataCargoTypes.concat(item.value) + ",";
                });

                let value = dataCargoTypes.replace(/,$/, "");

                value = value.concat("}");

                formik.setFieldValue("tipos_carga", value);
              }}
              title="Tipos de Carga"
              touched={formik.touched.tipos_carga}
              error={formik.errors.tipos_carga}
              disabled={props.isView}
              value={valueCargoTypes}
            />
          </div>
          <div>
          <SelectCustom
              data={billingPeriod}
              onChange={(selectedOption: any) => {
                formik.setFieldValue("periodo_faturamento", selectedOption.value);
              }}
              title="Período de Faturamento"
              touched={formik.touched.periodo_faturamento}
              error={formik.errors.periodo_faturamento}
              disabled={props.isView}
              value={valueCargoTypes}
            />
          </div>
          <div>
          <InputCustom
              title="Prazo de Pagamento"
              placeholder=""
              onChange={formik.handleChange("id_przpgto")}
              value={formik.values.id_przpgto}
              touched={formik.touched.id_przpgto}
              error={formik.errors.id_przpgto}
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
                formik.setFieldValue("id_estado", selectedOption.id);
                getCities(selectedOption.id);
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
                formik.setFieldValue("id_cidade", selectedOption.id);
                getNeighborhood(selectedOption.id);
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
                formik.setFieldValue("id_bairro", selectedOption.id);
              }}
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

          <div>
            <RadioGroupCustom
              title="Ativo"
              onChange={(value: string) =>
                formik.setFieldValue("ativo", value === "true")
              }
              value={formik.values.ativo}
              disabled={props.isView}
            />
          </div>
        </div>
      </div>

      {!props.isView && (
        <div className="flex items-center mt-6">
          <button
            type="button"
            className="w-full h-14 bg-[#003459] text-base text-[#fff] rounded-md mr-2"
            onClick={() => formik.handleSubmit()}
          >
            Salvar
          </button>
          <button
            type="button"
            className="w-full h-14 bg-[#9D9FA1] text-base text-[#fff] rounded-md"
          >
            Cancelar
          </button>
        </div>
      )}
    </>
  );
};

export default Form;
