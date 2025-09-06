import { ValueFormatterParams } from "ag-grid-community";
import React, { useCallback, useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import CallDriverActiveIcon from "../../../assets/images/callDriverIconActive.svg";
import CallDriverIcon from "../../../assets/images/callDriverIcon.svg";
import IconPayment from "../../../assets/images/iconPayment.svg";
import IdentifyDriverIcon from "../../../assets/images/identifyDriverIcon.svg";
import IdentifyVehicleIcon from "../../../assets/images/identifyVehicleIcon.svg";
import PaymentIcon from "../../../assets/images/paymentIcon.svg";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import TicketIcon from "../../../assets/images/ticketIcon.svg";
import Grid from "../../../components/Grid";
import { ColumnDef } from "../../../components/Grid/model/Grid";
import ModalDelete from "../../../components/ModalDelete";
import Loading from "../../../core/common/Loading";
import PrinterIcon from '../../../assets/images/printerIcon.png';

import {
  formatDateTimeBR,
  getActiveTypes,
  getCargoTypes,
  getOperationTypesPorto,
  maskCnpj,
  renderCargoTypes,
} from "../../../helpers/format";
import { STATUS_OPERACOES_PATIO_TRIAGEM } from "../../../helpers/status";
import { useModal } from "../../../hooks/ModalContext";
import { useStatus } from "../../../hooks/StatusContext";
import api from "../../../services/api";
import { FrontendNotification } from "../../../shared/Notification";
import Create from "./Create";
import Ticket from "./Create/Scheduling/components/Payment/Ticket";
import Info from "./Info";
import { ITriagens } from "./types/types";
import { useLinxPayment } from "../../../hooks/Payment/LinxPaymentContext";

// import { Container } from './styles';

const Triagens: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      headerName: "Data de Entrada",
      field: "entrada_veiculo.data_hora",
      fieldName: "data_hora",
      filter: true,
      filterParams: {
        dateBetween: true,
      },
      type: "dateColumn",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }

        return "---";
      },
    },
    {
      headerName: "Placa Dianteira",
      field: "entrada_veiculo.placa_dianteira",
      fieldName: "placa",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Identificadores dos Contêineres",
      field: "operacao_porto_agendada.identificadores_conteineres",
      fieldName: "identificadores_conteineres",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value.replace("{", "").replace("}", "");
        }
        return "---";
      },
    },
    {
      headerName: "Chamada Motorista",
      field: "chamada_motorista",
      filter: true,
      filterParams: {
        selected: {
          isMultiple: false,
          data: getActiveTypes(),
        },
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      headerName: "Tipo de Operação no Porto",
      field: "operacao_porto_agendada.tipo_carga",
      fieldName: "tipo_operacao_porto",
      filter: true,
      filterParams: {
        selected: {
          isMultiple: false,
          data: getOperationTypesPorto(),
        },
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.data) {
          if (params.data.id_operacao_porto_agendada !== null) {
            return "TRIAGEM";
          } else if (params.data.id_operacao_porto_carrossel !== null) {
            return "CARROSSEL";
          } else {
            return "ESTADIA";
          }
        }
        return "---";
      },
    },
    {
      headerName: "Tipo de Agendamento",
      field: "operacao_porto_agendada.tipo_carga",
      fieldName: "tipo_carga",
      filter: true,
      filterParams: {
        selected: {
          isMultiple: false,
          data: getCargoTypes(),
        },
      },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return renderCargoTypes(params.value).replaceAll(",", "");
        }
        return "---";
      },
    },
    {
      headerName: "Nome do Motorista",
      field: "motorista.nome",
      filter: true,
      fieldName: "cpf_motorista",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Terminal",
      field: "operacao_porto_agendada.terminal.razao_social",
      fieldName: "terminal",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return params.value;
        }
        return "---";
      },
    },
    {
      headerName: "Proprietario de Carga",
      field: "operacao_porto_carrossel.proprietarioDeCarga.razao_social",
      filter: true,
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
      fieldName: "transportadora",
      filter: true,
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
      fieldName: "cnpj_transportadora",
      filter: true,
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return maskCnpj(params.value);
        }
        return "---";
      },
    },
    {
      headerName: "Data de Saída",
      field: "entrada_veiculo.saida.data_hora",
      fieldName: "data_hora_saida",
      filter: true,
      filterParams: {
        dateBetween: true,
      },
      type: "dateColumn",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
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

  const linxPayment = useLinxPayment({
    autoInitialize: true,
    // onPaymentSuccess: handleLinxPaymentSuccess,
    // onPaymentError: handleLinxPaymentError
  });



  const getCallDriver = useCallback(async (data: ITriagens) => {
    try {
      setLoading(true);

      const body = {
        id_operacao_patio: data.id_operacao_patio,
        boolean_chamada: !data.chamada_motorista,
      };

      await api.post("/operacaopatio/chamadaMotorista", body);

      setSelectedRow(data);

      FrontendNotification(
        "Chamada do motorista realizada com sucesso!",
        "success"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      setLoading(false);
    } catch {
      setLoading(false);
    }
  }, []);

  const onDelete = useCallback(async (rowId?: number, data?: ITriagens) => {
    try {
      setLoading(true);

      if (data && data.status > 0) {
        const body = {
          id_operacao_patio: rowId,
        };

        await api.post("/deletar/desassociarTriagem", body);

        setLoading(false);

        setIsRemove(false);

        window.location.reload();
      } else {
        const body = {
          id_operacao_patio: rowId,
        };

        await api.post("/deletar/operacaoPatio", body);

        setLoading(false);

        setIsRemove(false);

        window.location.reload();
      }
    } catch {
      setLoading(false);
    }
  }, []);

  const reprintPayment = useCallback(async (data: ITriagens) => {
    try {


      const body = {
        id_operacao_patio: Number(data.id_operacao_patio),
        qtd_por_pagina: 100,
        order_by: "data_historico",
        order_direction: "desc",
      };

      const response = await api.post(
        `/operacaopatio/pagamentos?page=1`,
        body
      );

      const responseData = response.data.data;

      console.log(responseData)

      if (responseData.length > 0) {
        if (responseData[responseData.length - 1].administrative_code !== null) {
          await linxPayment.reprintPayment(responseData[responseData.length - 1].administrative_code);

          setSelectedRow(data);

          sessionStorage.setItem("@triagem", JSON.stringify(data));
          sessionStorage.setItem(
            "id_operacao_patio",
            JSON.stringify(data.id_operacao_patio)
          );
        }
      }
    } catch { }
  }, []);

  return (
    <>
      <Loading loading={loading} />
      <ToastContainer />

      {isRemove && (
        <ModalDelete
          title={selectedRow && selectedRow.status > 0 ? "Deseja cancelar a triagem?" : ""}
          message={selectedRow && selectedRow.status > 0 ? "Por favor, confirme que você deseja cancelar o seguinte registro:" : ""}
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() =>
            onDelete(selectedRow?.id_operacao_patio, selectedRow)
          }
          row={selectedRow?.entrada_veiculo.placa_dianteira}
        />
      )}
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
          <Ticket
            data={selectedRow}
            onClose={() => setShowTicket(!showTicket)}
          />
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
                  sessionStorage.setItem(
                    "id_operacao_patio",
                    JSON.stringify(data.id_operacao_patio)
                  );
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
                  sessionStorage.setItem(
                    "id_operacao_patio",
                    JSON.stringify(data.id_operacao_patio)
                  );
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
                  sessionStorage.setItem(
                    "id_operacao_patio",
                    JSON.stringify(data.id_operacao_patio)
                  );
                  setStatus(3.5);
                  openModal();
                },
                status: [10],
                icon: () => {
                  return PaymentIcon;
                },
              },
              {
                label: 'Listar Pagamento',
                action: (data: any) => {
                  setSelectedRow(data);
                  sessionStorage.setItem("@triagem", JSON.stringify(data));
                  sessionStorage.setItem(
                    "id_operacao_patio",
                    JSON.stringify(data.id_operacao_patio)
                  );
                  setStatus(3.5);
                  openModal();
                },
                status: [11],
                icon: () => {
                  return IconPayment;
                }
              },
              {
                label: 'Reimpressão',
                action: (data: any) => {
                  reprintPayment(data);
                },
                status: [11],
                icon: () => {
                  return PrinterIcon;
                }
              },
              {
                label: "Comprovante",
                action: (row: any) => {
                  setSelectedRow(row);
                  setShowTicket(false);
                  setShowTicket(true);
                  sessionStorage.setItem("@triagem", JSON.stringify(row));
                  sessionStorage.setItem(
                    "id_operacao_patio",
                    JSON.stringify(row.id_operacao_patio)
                  );
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
