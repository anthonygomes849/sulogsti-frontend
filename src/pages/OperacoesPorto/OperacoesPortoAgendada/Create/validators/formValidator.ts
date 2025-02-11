import { number, object, string } from 'yup';

export default object().shape({
  data_agendamento_terminal: string().required('Este campo é obrigatório!'),
  placa_dianteira_veiculo: number().required('Este campo é obrigatório!'),
  tipo_carga: number().required('Este campo é obrigatório!'),
  tipo_operacao: number().required('Este campo é obrigatório!'),
  id_terminal: number().required('Este campo é obrigatório!'),
  tolerancia_inicial: number().required('Este campo é obrigatório!'),
  tolerancia_final: number().required('Este campo é obrigatório!'),
  cpf_motorista: number().required('Este campo é obrigatório!'),
})