import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import {
  renderCargoTypes,
  renderOperationTypes,
} from "../../../helpers/format";
import { STATUS_OPERACOES_PORTO_AGENDADA } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import api from "../../../services/api";
import Create from "./Create";
import Info from "./Info";
import { IOperacoesPortoAgendada } from "./types/types";

// import { Container } from './styles';

const OperacoesPortoAgendada: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "data_agendamento_terminal",
      headerName: "Data/Hora",
    },
    {
      field: "tolerancia_inicio_agendamento",
      headerName: "Tolerância Inicial",
    },
    {
      field: "tolerancia_fim_agendamento",
      headerName: "Tolerância Final",
    },
    {
      field: "tipo_carga",
      headerName: "Tipo de Carga",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return String(renderCargoTypes(params.value)).replace(",", "");
        }
        return "---";
      },
    },
    {
      field: "tipo_operacao",
      headerName: "Tipo da Operação",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return renderOperationTypes(params.value);
        }
        return "---";
      },
    },
    {
      field: "cpf_motorista",
      headerName: "CPF Motorista",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "placa_dianteira_veiculo",
      headerName: "Placa Dianteira",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      field: "placa_traseira_veiculo",
      headerName: "Placa Traseira",
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
  const [selectedRow, setSelectedRow] = useState<IOperacoesPortoAgendada>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const { isModalOpen, openModal, closeModal } = useModal();

  const gridRef = useRef<any>();

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);
      const body = {
        id_operacao_porto_agendada: rowId,
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
    <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
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
          onConfirm={() => onDelete(selectedRow?.id_operacao_porto_agendada)}
          row={selectedRow?.placa_dianteira_veiculo}
        />
      )}

      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Agendamento"
          onClose={() => setIsView(!isView)}
        />
      )}

      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h1 className="text-2xl text-[#000000] font-bold">Operações Porto Agendada</h1>
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
      <div className="flex w-[calc(100vh - 90px)]">
        <Grid
          ref={gridRef}
          columns={columns}
          filters={[]}
          pagination
          path="/listar/operacaoPortoAgendada"
          onDelete={(data: any) => {
            setIsRemove(!isRemove);
            setSelectedRow(data);
          }}
          isShowStatus
          status={STATUS_OPERACOES_PORTO_AGENDADA}
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
  );
};

export default OperacoesPortoAgendada;
