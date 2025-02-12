import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";

import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { formatDateBR, maskedCPF, maskedPhone } from "../../../helpers/format";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import Create from "./Create";
import { IMotorista } from "./Create/types/types";
import Info from "./Info";

// import { Container } from './styles';

const ListMotorista: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "cpf",
      headerName: "CPF",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskedCPF(params.value);
        }
        return "---";
      },
    },
    {
      field: "nome",
      headerName: "Nome",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
        return "---";
      },
    },
    {
      field: "celular",
      headerName: "Celular",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskedPhone(params.value);
        }

        return "---";
      },
    },
    {
      field: "numero_cnh",
      headerName: "Número da CNH",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskedCPF(params.value);
        }
        return "---";
      },
    },
    {
      field: "categoria_cnh",
      headerName: "Categoria da CNH",
      filter: true,
    },
    {
      field: "data_expiracao_cnh",
      headerName: "Data de Expiraçao da CNH",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateBR(params.value);
        }
        return "---";
      },
    },
    {
      field: "endereco",
      headerName: "Endereço",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value && params.value !== "NULL") {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "complemento",
      headerName: "Complemento",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "numero",
      headerName: "Número",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "bairro",
      headerName: "Bairro",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---';
      },
    },
    {
      field: "cidade",
      headerName: "Cidade",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---';
      },
    },
    {
      field: "uf_estado",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "cep",
      headerName: "CEP",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "data_inativacao",
      headerName: "Data Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "dias_inativacao",
      headerName: "Dias de Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
      },
    },
    {
      field: "motivo_inativacao",
      headerName: "Motivo da Inativação",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return '---'
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
      },
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<IMotorista>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isModalOpen, openModal, closeModal } = useModal();

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_motorista: rowId,
      };

      await api.post("/deletar/motoristas", body);

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

      {isModalOpen && (
        <Create
          isEdit={isEdit}
          isView={isView}
          selectedRow={selectedRow}
          onClear={() => {
            setIsEdit(!isEdit);
            closeModal()
          }}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_motorista)}
          row={selectedRow?.nome}
        />
      )}

      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Motoristas"
          onClose={() => setIsView(!isView)}
        />
      )}

      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-3">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">Motoristas</h1>
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
            path="/listar/motoristas"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRow(data);
            }}
            status={[]}
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

export default ListMotorista;
