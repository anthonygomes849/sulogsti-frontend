import { object, string } from 'yup';

export default object().shape({
  id_operacao_entrada_veiculo: string().required('Este campo é obrigatório!'),
  tipo_operacao_porto: string().notOneOf(['2'], 'Este campo é obrigatório!').required('Este campo é obrigatório!'),
  id_operacao_porto_agendada: string().when('tipo_operacao_porto', {
    is: "0",
    then: (schema) => schema.required("Este campo é obrigatório!")
  }),
  id_operacao_porto_carrossel: string().when('tipo_operacao_porto', {
    is: "1",
    then: (schema) => schema.required("Este campo é obrigatório!")
  })
})