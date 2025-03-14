import { useFormik } from "formik";
import React, { useCallback, useEffect, useState } from "react";
import { FaTruck, FaTruckMoving, FaUser, FaUserAlt } from "react-icons/fa";
import InputCustom from "../../../../../components/InputCustom";
import SelectCustom from "../../../../../components/SelectCustom";
import Loading from "../../../../../core/common/Loading";
import api from "../../../../../services/api";
import { IMensalista } from "../../types/types";
import formValidator from "../validators/formValidator";
import ChoiceBox from "./shared/ChoiceBox";

interface FormValues {
  placa: string;
  cnpj: string;
  id_transportadora: string;
  ativo: boolean;
  tipo_transportadora: string;
}

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IMensalista;
  onConfirm: () => void;
  onClose: () => void;
}

const Form: React.FC<Props> = (props: Props) => {
  const [transportadoras, setTransportadoras] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [choiceOptions, setChoiceOptions] = useState([
    {
      id: 0,
      label: "CNPJ Avulso",
      icon: <FaUserAlt className="w-6 h-6 pr-2" color="white" />,
    },
    {
      id: 1,
      label: "Transportadora",
      icon: <FaTruck className="w-6 h-6 pr-2" />,
    },
  ]);

  const getTransportadoras = useCallback(async () => {
    try {
      setLoading(true);

      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post("/listar/transportadoras", body);

      const mappingData = response.data.data.map((rows: any) => {
        return {
          value: rows.id_transportadora,
          label: rows.razao_social,
        };
      });

      setTransportadoras(mappingData);

      setLoading(false);
    } catch {
      setLoading(false);
    }
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
          cnpj: values.cnpj,
          id_transportadora: values.id_transportadora,
          ativo: true,
          id_usuario_historico: userId,
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
    [props]
  );

  const onLoadFormValues = useCallback((row: any) => {
    const data = row;

    if (data) {
      formik.setFieldValue("placa", data.placa);
      formik.setFieldValue("cnpj", data.cnpj);
      formik.setFieldValue("tipo_transportadora", "0");
      if (data.mensalista_transportadora != null) {
        formik.setFieldValue(
          "id_transportadora",
          data.mensalista_transportadora.id_transportadora
        );
        formik.setFieldValue("tipo_transportadora", "1");
      }
      setChoiceOptions([
        {
          id: 0,
          label: "CNPJ Avulso",
          icon:
            data.mensalista_transportadora === null ? (
              <FaUserAlt className="w-6 h-6 pr-2" color="white" />
            ) : (
              <FaUser className="w-6 h-6 pr-2" />
            ),
        },
        {
          id: 1,
          label: "Transportadora",
          icon:
            data.mensalista_transportadora != null ? (
              <FaTruckMoving className="w-6 h-6 pr-2" color="white" />
            ) : (
              <FaTruck className="w-6 h-6 pr-2" />
            ),
        },
      ]);
      formik.setFieldValue("ativo", data.ativo);
    }
  }, []);

  const initialValues: FormValues = {
    placa: "",
    cnpj: "",
    id_transportadora: "",
    ativo: true,
    tipo_transportadora: "0",
  };

  const formik = useFormik({
    initialValues,
    validationSchema: formValidator,
    onSubmit: (values: FormValues) => handleSubmit(values, props.selectedRow),
  });

  const onConfirm = () => {
    formik.handleSubmit();
  };

  const onClose = () => {
    props.onClose();
  };

  useEffect(() => {
    getTransportadoras();
  }, [getTransportadoras]);

  useEffect(() => {
    if (props.isView || props.isEdit) {
      onLoadFormValues(props.selectedRow);
    }
  }, [props.isView, props.isEdit, props.selectedRow, onLoadFormValues]);

  return (
    <>
      <Loading loading={loading} />
      <div className="flex flex-col justify-between h-full">

      <div className="flex flex-col overflow-y-scroll max-w-[550px] p-5">
        <div className="grid grid-cols-1 gap-3 mb-4">
          <div className="w-1/2">
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
            <ChoiceBox
              data={choiceOptions}
              onChange={(value: number) => {
                formik.setFieldValue("tipo_transportadora", value);

                setChoiceOptions([
                  {
                    id: 0,
                    label: "CNPJ Avulso",
                    icon:
                      value === 0 ? (
                        <FaUserAlt className="w-6 h-6 pr-2" color="white" />
                      ) : (
                        <FaUser className="w-6 h-6 pr-2" />
                      ),
                  },
                  {
                    id: 1,
                    label: "Transportadora",
                    icon:
                      value === 1 ? (
                        <FaTruckMoving className="w-6 h-6 pr-2" color="white" />
                      ) : (
                        <FaTruck className="w-6 h-6 pr-2" />
                      ),
                  },
                ]);
              }}
              value={formik.values.tipo_transportadora}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1 mb-4 p-1">
          {Number(formik.values.tipo_transportadora) === 0 ? (
            <div className="w-full">
              <InputCustom
                title="CNPJ Avulso"
                typeInput="text"
                placeholder="CNPJ Avulso"
                onChange={formik.handleChange("cnpj")}
                touched={formik.touched.cnpj}
                error={formik.errors.cnpj}
                value={formik.values.cnpj}
                disabled={props.isView}
              />
            </div>
          ) : Number(formik.values.tipo_transportadora) === 1 ? (
            <div className="">
              <SelectCustom
                title="Transportadora"
                data={transportadoras}
                onChange={(selectedOption: any) =>
                  formik.setFieldValue(
                    "id_transportadora",
                    selectedOption.value
                  )
                }
                touched={formik.touched.id_transportadora}
                error={formik.errors.id_transportadora}
                value={formik.values.id_transportadora}
                disabled={props.isView}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="w-full min-h-14 flex items-center justify-end bg-[#FFFFFF] shadow-xl">
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#F9FAFA] text-sm text-[#000000] font-bold rounded-full mr-2"
          style={{ border: "1px solid #DBDEDF" }}
          onClick={() => onClose()}
        >
          Cancelar
        </button>
        <button
          type="button"
          className="w-24 h-9 pl-3 pr-3 flex items-center justify-center bg-[#0A4984] text-sm text-[#fff] font-bold rounded-full mr-2"
          onClick={() => onConfirm()}
        >
          Salvar
        </button>
      </div>
      </div>

    </>
  );
};

export default Form;
