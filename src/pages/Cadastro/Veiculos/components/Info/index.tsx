import React from "react";
import ModalSideBar from "../../../../../components/ModalSideBar";
import { formatDateTimeBR } from "../../../../../helpers/format";
import { IVeiculos } from "../../types/types";

// import { Container } from './styles';

interface Props {
  data?: IVeiculos;
  onClose: () => void;
  title: string;
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
              {props.data?.id_veiculo ? props.data.id_veiculo : "---"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Placa
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.placa
                ? props.data.placa.toUpperCase()
                : "---"}
            </span>
          </div>
        </div>
        <div className="w-full grid grid-cols-2 gap-2 gap-y-6 mt-4">
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Motorizado
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.tipo_parte_veiculo ? "SIM" : "NÃO"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Ano de Exercício do CRLV
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.ano_exercicio_crlv ? props.data.ano_exercicio_crlv : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Livre Acesso ao Pátio
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.livre_acesso_patio ? "SIM" : 'NÃO'}
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
