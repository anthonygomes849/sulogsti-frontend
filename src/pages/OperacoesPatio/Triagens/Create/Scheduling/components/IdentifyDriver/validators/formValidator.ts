import { object, string } from 'yup';

export default object().shape({
  id_motorista: string().required('Este campo é obrigatório!'),
})