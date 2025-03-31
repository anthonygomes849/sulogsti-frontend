import React from 'react';
import {ITransportadoras} from "../types/types.ts";
import ModalSideBar from "../../../../components/ModalSideBar";
import {formatDateBR, formatDateTimeBR, maskCnpj} from "../../../../helpers/format.ts";

interface Props {
    data?: ITransportadoras;
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
                        {props.data?.id_transportadora ? props.data.id_transportadora : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        CNPJ
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data && props.data.cnpj ? maskCnpj(props.data.cnpj) : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Razão Social
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.razao_social ? props.data.razao_social : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Nome Fantasia
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.nome_fantasia ? props.data.nome_fantasia : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Endereço
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.endereco ? props.data.endereco : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Cidade
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.cidade ? props.data.cidade : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Estado
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.uf_estado ? props.data.uf_estado : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        E-mail
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.email ? props.data.email : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        RNTRC
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.rntrc ? props.data.rntrc : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Expiração RNTRC
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data?.data_expiracao_rntrc ? formatDateBR(props.data.data_expiracao_rntrc) : '---'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Faturamento Triagem
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data && props.data.faturamento_triagem ? "SIM" : 'NÃO'}
                    </span>
                </div>
                <div className="flex flex-col w-full">
                    <span className="text-sm text-[#1E2121] font-semibold mb-1">
                        Faturamento Estadia
                    </span>
                    <span className="text-sm text-[#666666] font-normal">
                        {props.data && props.data.faturamento_estadia ? "SIM" : 'NÃO'}
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
}

export default Info;