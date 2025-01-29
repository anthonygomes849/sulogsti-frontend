import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import {
  formatDateBR,
  maskCnpj,
  maskedPhone,
  renderCargoTypes,
} from "../../../helpers/format";
import { STATUS_MOTORISTA } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import Create from "./Create";
import { ITerminal } from "./Create/types/types";

const Terminal: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "cnpj",
      headerName: "CNPJ",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskCnpj(params.value);
        }
      },
    },
    {
      field: "razao_social",
      headerName: "Razão Social",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "nome_fantasia",
      headerName: "Nome Fantasia",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.toUpperCase();
        }
      },
    },
    {
      field: "tipos_carga",
      headerName: "Tipos de Carga",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return renderCargoTypes(params.value);
        }
      },
    },
    {
      field: "celular",
      headerName: "Celular",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskedPhone(params.value);
        }
      },
    },
    {
      field: "telefone",
      headerName: "Telefone",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskedPhone(params.value);
        }
      },
    },
    {
      field: "endereco",
      headerName: "Endereço",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
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
      },
    },
    {
      field: "cep",
      headerName: "CEP",
      filter: true,
    },
    {
      field: "email",
      headerName: "E-mail",
      filter: true,
    },
    {
      field: "contato",
      headerName: "Contato",
      filter: true,
    },
    {
      field: "data_inativacao",
      headerName: "Data Inativação",
    },
    {
      field: "dias_inativacao",
      headerName: "Dias de Inativação",
    },
    {
      field: "motivo_inativacao",
      headerName: "Motivo da Inativação",
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
  const [selectedRow, setSelectedRow] = useState<ITerminal>();
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

      await api.post("/deletar/terminais", body);

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
          onClear={() => closeModal()}
          onConfirm={() => {
            window.location.reload();
          }}
        />
      )}

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(selectedRow?.id_terminal)}
        />
      )}
      <div className="flex flex-col w-full h-screen">
        <div className="flex w-screen">
          <Grid
            ref={gridRef}
            columns={columns}
            filters={[]}
            pagination
            path="/listar/terminais"
            onDelete={(data: any) => {
              setIsRemove(!isRemove);
              setSelectedRow(data);
            }}
            status={STATUS_MOTORISTA}
            onView={(data: any) => {
              setSelectedRow(data);
              setIsView(!isView);
              openModal();
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

export default Terminal;
