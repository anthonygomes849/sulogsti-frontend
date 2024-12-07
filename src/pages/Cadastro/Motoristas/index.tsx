import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";

import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import { formatDateBR, maskedCPF, maskedPhone } from "../../../helpers/format";
import { STATUS_MOTORISTA } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import Create from "./components/Create";

// import { Container } from './styles';

const ListMotorista: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "cpf",
      headerName: "CPF",
      // cellStyle: { textAlign: "left", marginLeft: "1rem" },
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return maskedCPF(params.value)
        }
      }
    },
    {
      field: "nome",
      headerName: "Nome",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value.toUpperCase();
        }
      }
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
      field: "numero_cnh",
      headerName: "Número da CNH",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return maskedCPF(params.value)
        }
      }
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
        if(params.value) {
          return formatDateBR(params.value);
        }
      }
    },
    {
      field: "endereco",
      headerName: "Endereço",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "complemento",
      headerName: "Complemento",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "numero",
      headerName: "Número",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "bairro",
      headerName: "Bairro",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "cidade",
      headerName: "Cidade",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "uf_estado",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return params.value;
        }
      }
    },
    {
      field: "cep",
      headerName: "CEP",
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
      filterParams: {
        filterOptions: ['inRange'],  // Enables filtering between two dates
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if(params.value) {
          return formatDateBR(params.value);
        }
      }
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [entityId, setEntityId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const { isModalOpen, closeModal } = useModal();

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId: number | null) => {
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
      <Loading loading={loading} />

      {isModalOpen && (
        <Create onClear={() => closeModal()} onConfirm={() => {}} />
      )}

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => onDelete(entityId)}
        />
      )}
      <div className="flex flex-col w-full h-screen">

        <div className="flex w-screen">
          <Grid
            ref={gridRef}
            columns={columns}
            filters={[]}
            pagination
            path="/listar/motoristas"
            onDelete={(rowId: number) => {
              console.log(rowId);
              setIsRemove(!isRemove);
              setEntityId(rowId);
            }}
            status={STATUS_MOTORISTA}
            onUpdate={() => {}}
            onView={() => {}}
          />
        </div>
      </div>
    </>
  );
};

export default ListMotorista;
