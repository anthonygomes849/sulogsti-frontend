import { object, string } from 'yup';

export default object().shape({
  placa: string().required('Este campo é obrigatório!'),
  rntrc: string().required('Este campo é obrigatório!')
})