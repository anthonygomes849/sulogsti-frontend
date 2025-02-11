import React from "react";
import ModalSideBar from "../../../../components/ModalSideBar";
import { formatDateBR, formatDateTimeBR, maskedCPF, maskedPhone } from "../../../../helpers/format";
import { IMotorista } from "../Create/types/types";

// import { Container } from './styles';

interface Props {
  data?: IMotorista;
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
              {props.data?.id_motorista ? props.data.id_motorista : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              CPF
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.cpf ? maskedCPF(props.data.cpf) : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Nome
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.nome ? props.data.nome : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Endereço
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.endereco && props.data.endereco !== "NULL" ? props.data.endereco : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Número
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data && props.data.numero ? props.data.numero : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Celular
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.celular ? maskedPhone(props.data.celular) : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Número da CNH
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.numero_cnh ? maskedCPF(props.data.numero_cnh) : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Categoria da CNH
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.categoria_cnh ? props.data.categoria_cnh : '---'}
            </span>
          </div>
          <div className="flex flex-col w-full">
            <span className="text-sm text-[#1E2121] font-semibold mb-1">
              Data de Expiração da CNH
            </span>
            <span className="text-sm text-[#666666] font-normal">
              {props.data?.data_expiracao_cnh ? formatDateBR(props.data.data_expiracao_cnh) : '---'}
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
