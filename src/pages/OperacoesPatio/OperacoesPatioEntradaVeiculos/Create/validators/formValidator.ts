import { object, string } from 'yup';

export default object().shape({
  data_hora: string().required('Este campo é obrigatório!'),
  placa_dianteira: string().required('Este campo é obrigatório!'),
  numero_partes_nao_motorizada: string().required('Este campo é obrigatório!'),
  id_operacao_patio_cancela: string().required('Este campo é obrigatório!'),
})