import { object, string } from 'yup';

export default object().shape({
  tipo_servico: string().required('Este campo é obrigatório!'),
})