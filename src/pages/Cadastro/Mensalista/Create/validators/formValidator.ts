import { number, object, string } from 'yup';

export default object().shape({
  placa: string().required('Este campo é obrigatório!'),
  id_transportadora: number().required('Este campo é obrigatório!'),
})