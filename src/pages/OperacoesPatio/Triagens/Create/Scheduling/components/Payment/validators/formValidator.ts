import { object, string } from 'yup';

export default object().shape({
  tipo_pagamento: string().required('Este campo é obrigatório!'),
  valor_pago: string().required('Este campo é obrigatório!'),
  desconto: string().notRequired(),
  cpf_supervisor: string().when("desconto", {
    is: (value: string) => value && value.trim().length > 0 && value > "0.00",
    then: (schema) => schema.required("Este campo é obrigatório")
  }),
})