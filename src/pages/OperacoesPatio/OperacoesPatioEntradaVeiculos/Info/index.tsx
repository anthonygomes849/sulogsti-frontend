import React from "react";
import ModalSideBar from "../../../../components/ModalSideBar";
import { formatDateTimeBR } from "../../../../helpers/format";
import { IOperacoesPatioEntradaVeiculos } from "../Create/types/types";

// import { Container } from './styles';

interface Props {
  data?: IOperacoesPatioEntradaVeiculos;
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
              {props.data?.id_operacao_patio_entrada_veiculo ? props.data.id_operacao_patio_entrada_veiculo : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Data/Hora Entrada
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.data_hora ? props.data.data_hora : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Placa Dianteira
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.placa_dianteira ? props.data.placa_dianteira : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Cancela Entrada
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.id_operacao_patio_cancela ? props.data.id_operacao_patio_cancela : '---'}
            </span>
          </div>
          
        </div>
        <div className="w-full grid grid-cols-1 gap-2 gap-y-6 mt-4">
        <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Data Modificação
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.data_historico ? formatDateTimeBR(props.data.data_historico) : '---'}
            </span>
          </div>
        </div>
      </div>
    </ModalSideBar>
  );
};

export default Info;
