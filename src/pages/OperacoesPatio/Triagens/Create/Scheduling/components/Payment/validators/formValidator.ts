import { object, string } from 'yup';

export default object().shape({
  tipo_pagamento: string().required('Este campo é obrigatório!'),
  valor_pago: string().required('Este campo é obrigatório!'),
})