import React from "react";
import ModalSideBar from "../../../../components/ModalSideBar";
import { formatDateTimeBR, renderCargoTypes } from "../../../../helpers/format";
import { ITriagens } from "../types/types";

// import { Container } from './styles';

interface Props {
  data?: ITriagens;
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
              Data/Hora Entrada
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.entrada_veiculo
                ? props.data.entrada_veiculo.data_hora
                : "---"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Chamada Motorista
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.chamada_motorista ? "SIM" : "NÃO"}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Placa Dianteira
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.entrada_veiculo
                ? props.data.entrada_veiculo.placa_dianteira
                : "---"}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo de Operação no Porto
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.id_operacao_porto_agendada !== null
                ? "TRIAGEM"
                : props.data?.id_operacao_porto_carrossel !== null
                ? "CARROSSEL"
                : "ESTADIA"}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo Agendamento
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.operacao_porto_agendada !== null
                ? renderCargoTypes(
                    props.data.operacao_porto_agendada.tipo_carga
                  )
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
