import { object, string } from 'yup';

export default object().shape({
  id_veiculo_parte_motorizada: string().required('Este campo é obrigatório!'),
  tipo_veiculo: string().notRequired(),
  id_transportadora: string().required('Este campo é obrigatório!')
})