import { bool, number, object, string } from 'yup';

export default object().shape({
  placa: string().required('Este campo é obrigatório!'),
  id_estado: number().required('Este campo é obrigatório!'),
  tipoParteVeiculo: string().required('Este campo é obrigatório!'),
  anoExercicioCRLV: string().required('Este campo é obrigatório!'),
  livreAcessoPatio: bool().required('Este campo é obrigatório!'),
  ativo: bool().required('Este campo é obrigatório!'),
})