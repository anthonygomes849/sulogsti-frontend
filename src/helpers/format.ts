import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const maskedCPF = (value: string) => {
  value = value.replace(/\D/g, "")                    //Remove tudo o que não é dígito
  value = value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  value = value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
  return value
}

export const maskedPhone = (value: string) => {
  value = value.replace(/\D/g, ""); //Remove tudo o que não é dígito
  value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
  value = value.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
  return value;
}

export const formatDateBR = (value: string) => {
  return format(new Date(value), 'dd/MM/yyyy', {
    locale: ptBR
  })
}