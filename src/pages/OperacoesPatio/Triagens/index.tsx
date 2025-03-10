import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import CallDriverActiveIcon from "../../../assets/images/CallDriverActiveIcon.svg";
import CallDriverIcon from "../../../assets/images/callDriverIcon.svg";
import IdentifyDriverIcon from "../../../assets/images/identifyDriverIcon.svg";
import IdentifyVehicleIcon from "../../../assets/images/identifyVehicleIcon.svg";
import PaymentIcon from "../../../assets/images/paymentIcon.svg";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import TicketIcon from "../../../assets/images/ticketIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import Loading from "../../../core/common/Loading";
import { maskCnpj, renderCargoTypes } from "../../../helpers/format";
import { STATUS_OPERACOES_PATIO_TRIAGEM } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import { useStatus } from "../../../hooks/StatusContext";
import api from "../../../services/api";
import { FrontendNotification } from "../../../shared/Notification";
import Create from "./Create";
import Ticket from "./Create/Scheduling/components/Payment/Ticket";
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
      headerName: "Placa Dianteira",
      field: "entrada_veiculo.placa_dianteira",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
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
  const [loading, setLoading] = useState<boolean>(false);
  const [showTicket, setShowTicket] = useState<boolean>(false);

  const gridRef: any = useRef();

  const { openModal, isModalOpen, closeModal } = useModal();

  const { setStatus } = useStatus();

  const getCallDriver = useCallback(async (data: ITriagens) => {
    try {
      setLoading(true);

      const body = {
        id_operacao_patio: data.id_operacao_patio,
        boolean_chamada: true,
      };

      await api.post("/operacaopatio/chamadaMotorista", body);

      setSelectedRow(data);

      FrontendNotification('Chamada do motorista realizada com sucesso!', 'success');
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  
  return (
    <>
      <Loading loading={loading} />
      <ToastContainer />
      {isModalOpen && (
        <Create
          isEdit={isEdit}
          isView={isView}
          selectedRow={selectedRow}
          onClear={() => {
            window.location.reload();
            closeModal();
          }}
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
      {showTicket && (
        <div className="hidden">
          <Ticket data={selectedRow} onClose={() => {}} />
        </div>
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
        <div className="flex w-[calc(100vh - 90px)]">
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
                label: "Identificar Motorista",
                action: (data: ITriagens) => {
                  setSelectedRow(data);
                  sessionStorage.setItem("@triagem", JSON.stringify(data));
                  setStatus(1);
                  openModal();
                },
                status: [0, 1, 6],
                icon: () => {
                  return IdentifyDriverIcon;
                },
              },
              {
                label: "Identificar Veiculo",
                action: (data: ITriagens) => {
                  setSelectedRow(data);
                  sessionStorage.setItem("@triagem", JSON.stringify(data));
                  setStatus(2);
                  openModal();
                },
                status: [3, 4],
                icon: () => {
                  return IdentifyVehicleIcon;
                },
              },
              {
                label: "Chamar Motorista",
                action: (data: ITriagens) => {
                  getCallDriver(data);
                },
                status: [2, 3, 4, 5],
                icon: (data: ITriagens) => {
                  return data.chamada_motorista
                    ? CallDriverActiveIcon
                    : CallDriverIcon;
                },
              },
              {
                label: "Pagamento",
                action: (data: any) => {
                  setSelectedRow(data);
                  sessionStorage.setItem("@triagem", JSON.stringify(data));
                  setStatus(3);
                  openModal();
                },
                status: [10],
                icon: () => {
                  return PaymentIcon;
                },
              },
              {
                label: "Comprovante",
                action: (row: any) => {
                  setSelectedRow(row);
                  setShowTicket(false);
                  setShowTicket(true);
                  sessionStorage.setItem("@triagem", JSON.stringify(row));
                },
                status: [11, 12, 13, 14, 15, 16],
                icon: () => {
                  return TicketIcon;
                },
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default Triagens;
