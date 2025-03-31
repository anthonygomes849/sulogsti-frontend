import { object, string } from 'yup';

export default object().shape({
  cnpj: string().required('* Campo obrigatório!'),
  razao_social: string().required('* Campo obrigatório!'),
  endereco: string().required('* Campo obrigatório!'),
  id_cidade: string().required('* Campo obrigatório!'),
  id_estado: string().required('* Campo obrigatório!'),
  email: string().required('* Campo obrigatório!'),
  tipos_carga: string().required('*  Campo obrigatório!')
})