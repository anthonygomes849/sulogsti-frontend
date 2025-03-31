import React from "react";
import ModalSideBar from "../../../../components/ModalSideBar";
import { formatDateTimeBR, renderCargoTypes, renderOperationTypes } from "../../../../helpers/format";
import { IOperacoesPortoAgendada } from "../types/types";

// import { Container } from './styles';

interface Props {
  data?: IOperacoesPortoAgendada;
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
              {props.data?.id_operacao_porto_agendada ? props.data.id_operacao_porto_agendada : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Data/Hora Entrada
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.data_agendamento_terminal ? props.data.data_agendamento_terminal : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tolerância Inicial
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tolerancia_inicio_agendamento ? props.data.tolerancia_inicio_agendamento : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tolerância Final
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tolerancia_fim_agendamento ? props.data.tolerancia_fim_agendamento : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Placa Dianteira
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.placa_dianteira_veiculo ? props.data.placa_dianteira_veiculo : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Placa Traseira
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.placa_traseira_veiculo ? props.data.placa_traseira_veiculo : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Identificadores Conteineres
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.identificadores_conteineres ? props.data.identificadores_conteineres : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Terminal
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.terminal ? props.data.terminal.razao_social : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo de Carga 
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tipo_carga ? renderCargoTypes(props.data.tipo_carga).replace(',', '') : '---'}
            </span>
          </div>

          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Tipo de Operação
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.tipo_operacao ? renderOperationTypes(props.data.tipo_operacao).replace(',', '') : '---'}
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
