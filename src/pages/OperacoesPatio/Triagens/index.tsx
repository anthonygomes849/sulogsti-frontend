import React, { useRef, useState } from "react";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import { STATUS_OPERACOES_PATIO_TRIAGEM } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import { ITriagens } from "./types/types";

// import { Container } from './styles';

const Triagens: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      headerName: 'Data de Entrada',
      field: 'entrada_veiculo.data_hora'
    }
  ])
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] =
    useState<ITriagens>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const gridRef: any = useRef();

  const { openModal } = useModal();

  return (
    <>
      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-3">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">
              Triagens
            </h1>
          </div>
          <div className="mr-14">
            <button
              className="flex items-center justify-center h-12 w-36 bg-[#062D4E] text-[#FFFFFF] text-sm font-light border-none rounded-full"
              onClick={() => openModal()}
            >
              Adicionar <img src={PlusButtonIcon} alt="" className="ml-2" />
            </button>
          </div>
        </div>
        <div className="flex w-screen">
          <Grid
            ref={gridRef}
            columns={columns}
            filters={[]}
            pagination
            path="/listar/operacaoPatioTriagem"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRow(data);
            }}
            isShowStatus
            status={STATUS_OPERACOES_PATIO_TRIAGEM}
            onView={(data: any) => {
              setSelectedRow(data);
              setIsView(!isView);
            }}
            onUpdate={(data: any) => {
              setSelectedRow(data);
              setIsEdit(!isEdit);
              openModal();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Triagens;
