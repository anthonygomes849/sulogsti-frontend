import React from "react";
import ModalSideBar from "../../../../components/ModalSideBar";
import { formatDateTimeBR } from "../../../../helpers/format";
import { ITipoServico } from "../Create/types/types";

// import { Container } from './styles';

interface Props {
  data?: ITipoServico;
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
              {props.data?.id_tipo_servico ? props.data.id_tipo_servico : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo do Serviço
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tipo_servico ? props.data.tipo_servico : '---'}
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
