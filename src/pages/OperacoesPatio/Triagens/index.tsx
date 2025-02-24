import { ValueFormatterParams } from "ag-grid-community";
import React, { useRef, useState } from "react";
import IdentifyDriverIcon from '../../../assets/images/identifyDriverIcon.svg';
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import { maskCnpj, renderCargoTypes } from "../../../helpers/format";
import { STATUS_OPERACOES_PATIO_TRIAGEM } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import Create from "./Create";
import Info from "./Info";
import { ITriagens } from "./types/types";

// import { Container } from './styles';

const Triagens: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      headerName: "Data de Entrada",
      field: "entrada_veiculo.data_hora",
    },
    {
      headerName: "Chamada Motorista",
      field: "chamada_motorista",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      headerName: "Data de Saída",
      field: "entrada_veiculo.saida.data_hora",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Placa Dianteira",
      field: "entrada_veiculo.placa_dianteira",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Transportadora",
      field: "operacao_porto_agendada.transportadora.razao_social",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "CNPJ da Transportadora",
      field: "operacao_porto_agendada.transportadora.cnpj",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskCnpj(params.value);
        }
        return "---";
      },
    },
    {
      headerName: "Terminal",
      field: "operacao_porto_agendada.terminal.razao_social",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Proprietario de Carga",
      field: "proprietario_carga",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "CPF do Motorista",
      field: "operacao_porto_agendada.cpf_motorista",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Tipo de Agendamento",
      field: "operacao_porto_agendada.tipo_carga",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return renderCargoTypes(params.value).replaceAll(",", "");
        }
        return "---";
      },
    },
    {
      headerName: "Tipo de Operação no Porto",
      field: "operacao_porto_agendada.tipo_carga",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.data.id_operacao_porto_agendada !== null) {
          return "TRIAGEM";
        } else if (params.data.id_operacao_porto_carrossel !== null) {
          return "CARROSSEL";
        } else {
          return "ESTADIA";
        }
      },
    },
    {
      headerName: "Identificadores dos Contêineres",
      field: "operacao_porto_agendada.identificadores_conteineres",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.replace("{", "").replace("}", "");
        }
        return "---";
      },
    },
  ]);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<ITriagens>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const gridRef: any = useRef();

  const { openModal, isModalOpen, closeModal } = useModal();

  return (
    <>
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

      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Triagens"
          onClose={() => setIsView(!isView)}
        />
      )}

      <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
        <div className="flex items-center justify-between w-full mb-3">
          <div>
            <h1 className="text-2xl text-[#000000] font-bold">Triagens</h1>
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
            customButtons={[
              {
                label: 'Identificar Motorista',
                action: () => {},
                status: [0, 1],
                icon: IdentifyDriverIcon,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Triagens;
