import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { formatDateBR, formatDateTimeBR } from "../../../helpers/format";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import { ITerminal } from "../../Cadastro/Terminal/Create/types/types";

// import { Container } from './styles';

const OperacoesPatioEntradaVeiculos: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "data_hora",
      headerName: "Data/Hora Entrada",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }
        return "---";
      },
    },
    {
      field: "placa_dianteira",
      headerName: "Placa Dianteira",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
        return "---";
      },
    },
    {
      field: "id_operacao_patio_cancela",
      headerName: "Cancela Entrada",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "data_inativacao",
      headerName: "Data Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "dias_inativacao",
      headerName: "Dias de Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "motivo_inativacao",
      headerName: "Motivo da Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "data_historico",
      headerName: "Data de Modificação",
      filter: true,
      cellDataType: "date",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateBR(params.value);
        }
        return "----";
      },
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ITerminal>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const gridRef: any = useRef();

  const { isModalOpen, openModal, closeModal } = useModal();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_motorista: rowId,
      };

      await api.post("/deletar/operacaoPortoAgendada", body);

      setLoading(false);

      setIsRemove(false);

      window.location.reload();
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <>
      <Loading loading={loading} />
{/* 
      {isModalOpen && (
        <Create
          isEdit={isEdit}
          isView={isView}
          selectedRow={selectedRow}
          onClear={() => closeModal()}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )} */}

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_terminal)}
          row={selectedRow?.razao_social}
        />
      )}

      {/* {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Terminais"
          onClose={() => setIsView(!isView)}
        />
      )} */}
      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-7">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">Entrada e saída de veículos</h1>
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
            path="/listar/entradaSaidaVeiculos"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRow(data);
            }}
            status={[]}
            onView={(data: any) => {
              setSelectedRow(data);
              setIsView(!isView);
              // openModal();
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

export default OperacoesPatioEntradaVeiculos;
