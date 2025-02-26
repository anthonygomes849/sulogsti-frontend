import { object, string } from 'yup';

export default object().shape({
  id_veiculo: string().required('Este campo é obrigatório!'),
})