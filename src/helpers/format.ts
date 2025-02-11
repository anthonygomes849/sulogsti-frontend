import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { domainTiposCarga, domainTypesOperation } from './renderer';

export const maskedCPF = (value: string) => {
  value = value.replace(/\D/g, "")                    //Remove tudo o que não é dígito
  value = value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  value = value.replace(/(\d{3})(\d)/, "$1.$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
  return value
}

export const maskCnpj = (cnpj: string) => {
  // Remove non-digit characters
  cnpj = cnpj.replace(/\D/g, "");

  // Apply the CNPJ mask
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
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

export const formatDateTimeBR = (value: string) => {
  return format(new Date(value), 'dd/MM/yyyy HH:mm:ss', {
    locale: ptBR
  })
}

export const maskedPlate = (value: string) => {
  value = value.replace(/(\d{3})(\d)/, "$1-$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  return value
}

export const maskedZipcode = (value: string) => {
  value = value.replace(/(\d{5})(\d)/, "$1-$2")       //Coloca um ponto entre o terceiro e o quarto dígitos
  return value
}

export const renderCargoTypes = (data: any) => {
  let s = "";

  // data vem do banco assim: {1}
  // cadastros terminais

  if (isNaN(data)) {
    data = data.replace("{", "");
    data = data.replace("}", "");

    let arrayData = data.split(",");

    for (var i = 0; i < arrayData.length; i++) {
      console.log(arrayData.length);
      if (i < arrayData.length - 1) {
        s += domainTiposCarga[parseInt(arrayData[i]) - 1] + ",";
      } else {
        s += domainTiposCarga[parseInt(arrayData[i]) - 1]

      }
    }
  } else {
    s += domainTiposCarga[parseInt(data) - 1] + ",";
  }

  // s = s.slice(0, -7);

  return s;
}

export const renderOperationTypes = (data: any) => {
  return domainTypesOperation[parseInt(data) - 1];
}