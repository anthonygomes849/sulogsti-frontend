import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";

import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import CreateVeiculos from "./components/Create";
import Info from "./components/Info";
import { IVeiculos } from "./types/types";

const ListVeiculo: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "placa",
      headerName: "Placa",
      cellStyle: { textAlign: "left", marginLeft: "1rem" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "uf_estado",
      headerName: "Estado",
      cellStyle: { textAlign: "left" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "tipo_parte_veiculo",
      headerName: "Motorizado",
      cellStyle: { textAlign: "left" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: "renavam",
      headerName: "RENAVAM",
      cellStyle: { textAlign: "left" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "rntrc",
      headerName: "RNTRC",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "data_expiracao_rntrc",
      headerName: "Expiraçao do RNTRC",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "ano_exercicio_crlv",
      headerName: "Ano de Exercício do CRLV",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "livre_acesso_patio",
      headerName: "Livre Acesso ao Pátio",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
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
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRows] = useState<IVeiculos>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isModalOpen, closeModal, openModal } = useModal();

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_veiculo: rowId,
      };

      await api.post("/deletar/veiculos", body);

      setLoading(false);

      setIsRemove(false);

      window.location.reload();
    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <>
      {isModalOpen && (
        <CreateVeiculos
          isView={isView}
          isEdit={isEdit}
          selectedRow={selectedRow}
          onClear={() => {
            closeModal();
            setIsEdit(false);
          }}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}
      <Loading loading={loading} />
      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_veiculo)}
          row={selectedRow?.placa}
        />
      )}

      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Veículos"
          onClose={() => setIsView(!isView)}
        />
      )}
      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-7">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">Veículos</h1>
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
            path="/listar/veiculos"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRows(data);
            }}
            status={[]}
            onView={(data: any) => {
              setSelectedRows(data);
              setIsView(!isView);
            }}
            onUpdate={(data: any) => {
              setSelectedRows(data);
              setIsEdit(!isEdit);
              openModal();
            }}
          />
        </div>
      </div>
    </>
  );
};

export default ListVeiculo;
