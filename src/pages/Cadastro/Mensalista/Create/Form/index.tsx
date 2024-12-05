import React, { useCallback, useEffect } from 'react';
import InputCustom from '../../../../../components/InputCustom';
import api from '../../../../../services/api';
import { IMensalista } from '../../types/types';

interface Props {
  isView?: boolean;
  isEdit?: boolean;
  selectedRow?: IMensalista;
  onConfirm: () => void;
}

const Form: React.FC<Props> = (props: Props) => {

  const getTransportadoras = useCallback(async () => {
    try {
      const body = {
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc"
      };

      const response = await api.post('/listar/transportadoras', body);

    }catch{}
  }, [])

  useEffect(() => {
    getTransportadoras();
  }, []);

  return (
    <>
      <div className='grid grid-cols-2 gap-3 mb-4'>
        <div>
          <InputCustom 
            title='Placa'
            typeInput='mask'
            mask="aaa-9*99"
            placeholder='AAA-0000 OU AAA-0A00'
            onChange={() => {}}
          />
        </div>
      </div>
    </>
  );
}

export default Form;