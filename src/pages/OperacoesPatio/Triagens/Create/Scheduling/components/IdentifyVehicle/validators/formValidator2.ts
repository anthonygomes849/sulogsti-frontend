import { object, ref, string } from 'yup';

export default object().shape({
  id_veiculo_parte_motorizada: string().required('Este campo é obrigatório!'),
  id_veiculo_parte_nao_motorizada: string().required('Este campo é obrigatório!').notOneOf([ref('id_veiculo_parte_motorizada'), ''], 'A placa dianteira não pode ser igual a placa traseira!'),
  tipo_veiculo: string().required('Este campo é obrigatório!'),
  id_transportadora: string().required('Este campo é obrigatório!')
})