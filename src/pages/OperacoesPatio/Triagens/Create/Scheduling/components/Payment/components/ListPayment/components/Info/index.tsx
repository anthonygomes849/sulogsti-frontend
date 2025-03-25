import React from "react";
import ModalSideBar from "../../../../../../../../../../../components/ModalSideBar";
import { formatDateTimeBR, renderPaymentTypes } from "../../../../../../../../../../../helpers/format";

// import { Container } from './styles';

interface Props {
  data?: any;
  title: string;
  onClose: () => void;
}

const Info: React.FC<Props> = (props: Props) => {
  return (
    <ModalSideBar isOpen title={props.title} onClose={props.onClose}>
      <div className="w-full h-full">
        <div className="w-full grid grid-cols-2 gap-2 gap-y-6">
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              ID
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.id_operacao_patio
                ? props.data.id_operacao_patio
                : "---"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
            Data Pagamento
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.data_hora_pagamento
                ? props.data.data_hora_pagamento
                : "---"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo de Pagamento
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && renderPaymentTypes(props.data.tipo_pagamento)}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tempo Base Triagem
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tempo_base_triagem
                ? props.data.tempo_base_triagem
                : "---"}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Valor Total
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && `R$ ${props.data.valor_total}`}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Valor Pago
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.quantia_paga
                ? `R$ ${props.data.quantia_paga}`
                : "---"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Desconto
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.desconto
                ? `R$ ${props.data.desconto}`
                : "---"}
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 gap-2 gap-y-6 mt-4">
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Data Modificação
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.data_historico
                ? formatDateTimeBR(props.data.data_historico)
                : "---"}
            </span>
          </div>
        </div>
      </div>
    </ModalSideBar>
  );
};

export default Info;
