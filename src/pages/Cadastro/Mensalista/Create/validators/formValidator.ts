import { number, object, string } from 'yup';

export default object().shape({
  placa: string().required('Este campo é obrigatório!'),
  cnpj: string().when('tipo_transportadora', {
    is: "0",
    then: (schema) => schema.required("Este campo é obrigatório!")
}),
  id_transportadora: number().when('tipo_transportadora', {
    is: "1",
    then: (schema) => schema.required("Este campo é obrigatório!")
}),
})