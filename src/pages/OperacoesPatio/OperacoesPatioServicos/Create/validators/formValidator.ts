import { number, object, string } from 'yup';

export default object().shape({
  id_tipo_servico: string().required('Este campo é obrigatório!'),
  id_operacao_patio_entrada_veiculo: number().required('Este campo é obrigatório!')
})