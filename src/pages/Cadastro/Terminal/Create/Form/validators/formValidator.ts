import { bool, object, string } from 'yup';

export default object().shape({
  cpf: string().required('Este campo é obrigatório!'),
  nome: string().required('Este campo é obrigatório!'),
  numero_cnh: string().required('Este campo é obrigatório!'),
  categoria_cnh: string().required('Este campo é obrigatório!'),
  data_expiracao_cnh: string().required('Este campo é obrigatório!'),
  celular: string().required('Este campo é obrigatório!'),
  id_estado: string().required('Este campo é obrigatório!'),
  ativo: bool().required('Este campo é obrigatório!'),
})