import React, { useState, useRef, useCallback, useEffect } from "react";
import "./styles.css";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact } from "ag-grid-react";
import DeleteIcon from "../../../../../../../../../assets/images/deleteIcon.svg";
import InfoIcon from "../../../../../../../../../assets/images/infoIcon.svg";
import PlusButtonIcon from "../../../../../../../../../assets/images/PlusButtonIcon.svg";
import CustomStatusFilter from "../../../../../../../../../components/Grid/components/CustomStatusFilter";
import Status from "../../../../../../../../../components/Grid/components/Status";
import { RowSelection } from "../../../../../../../../../components/Grid/model/Grid";
import ModalDelete from "../../../../../../../../../components/ModalDelete";
import Loading from "../../../../../../../../../core/common/Loading";
import {
  formatDateTimeBR,
  renderPaymentTypes,
} from "../../../../../../../../../helpers/format";
import { STATUS_PAGAMENTO } from "../../../../../../../../../helpers/status";
import { useStatus } from "../../../../../../../../../hooks/StatusContext";
import api from "../../../../../../../../../services/api";
import Info from "./components/Info";
import ReversedPayment from "./components/ReversedPayment";

// Import the new separated Linx payment configuration
import {
  useLinxPayment,
  PaymentMethodType,
  type LinxPaymentResponse,
  type LinxPaymentError,
} from "../../../../../../../../../services/payment/linx";

interface PaymentRowData {
  id_operacao_patio_pagamento: number;
  administrative_code: string | null;
  data_hora_pagamento: string;
  tipo_pagamento: number;
  tempo_base_triagem: number;
  quantia_paga: number;
  status: number;
}

const ListPayment: React.FC = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [rowData, setRowData] = useState<PaymentRowData[]>([]);
  const [selectedRow, setSelectedRow] = useState<PaymentRowData>();
  const [isView, setIsView] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [gridApi, setGridApi] = useState<any>(null);
  const [currentRow, setCurrentRow] = useState<any>();
  const [isReversedPayment, setIsReversedPayment] = useState(false);
  const [paymentInProgress, setPaymentInProgress] = useState<PaymentRowData | null>(null);

  const { setStatus } = useStatus();
  const gridRef = useRef<AgGridReact>(null);

  const paymentInProgressRef = useRef<PaymentRowData | null>(null);


  // Use the new Linx payment hook
  const linxPayment = useLinxPayment({
    autoInitialize: true,
    onPaymentSuccess: handleLinxPaymentSuccess,
    onPaymentError: handleLinxPaymentError,
  });

  /**
   * Handle successful Linx payment for reversal
   */
  function handleLinxPaymentSuccess(response: LinxPaymentResponse): void {
    console.log('Linx payment reversal successful:', response);
    console.log('Payment row being processed:', paymentInProgressRef.current);
    
    // Use the paymentInProgress row instead of selectedRow
    if (paymentInProgressRef.current) {
      onDelete(paymentInProgressRef.current.id_operacao_patio_pagamento);
    } else {
      console.error('No payment in progress found for reversal');
    }
    
    // Clear the payment in progress
    setPaymentInProgress(null);
  }

  /**
   * Handle Linx payment error for reversal
   */
  function handleLinxPaymentError(error: LinxPaymentError): void {
    console.error('Linx payment reversal error:', error);
    console.log('Payment row that failed:', paymentInProgress);
    
    // Clear the payment in progress on error
    setPaymentInProgress(null);
    
    // Error is already handled by the utility functions
  }

  const defaultColumns = [
    {
      field: "data_hora_pagamento",
      headerName: "Data do pagamento",
      valueFormatter: (params: any) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }
        return "---";
      },
    },
    {
      field: "tipo_pagamento",
      headerName: "Tipo de pagamento",
      valueFormatter: (params: any) => {
        if (params.value) {
          return renderPaymentTypes(params.value);
        }
        return "---";
      },
    },
    {
      field: "tempo_base_triagem",
      headerName: "Tempo base Triagem",
    },
    {
      field: "quantia_paga",
      headerName: "Valor Pago",
      valueFormatter: (params: any) => {
        if (params.value) {
          return `R$ ${params.value}`;
        }
        return "---";
      },
    },
    {
      field: "",
      headerName: "",
      pinned: "right",
      cellRenderer: (params: any) => {
        if (params.data) {
          return (
            <div>
              <button
                className="mr-4"
                onClick={() => {
                  setSelectedRow(params.data);
                  setIsView(!isView);
                }}
              >
                <img src={InfoIcon} style={{ width: 16, height: 16 }} alt="Info" />
              </button>
              <button
                onClick={() => {
                  setSelectedRow(params.data);
                  setIsReversedPayment(!isReversedPayment);
                }}
              >
                <img src={DeleteIcon} style={{ width: 16, height: 16 }} alt="Delete" />
              </button>
            </div>
          );
        }
      },
    },
  ];

  const onGridReady = useCallback(async (params: any) => {
    try {
      console.log("Grid ready");
      let cols: any[] = [...defaultColumns];

      console.log("passou");

      cols.unshift({
        field: "status",
        headerName: "Status",
        filter: CustomStatusFilter,
        filterParams: {
          status: STATUS_PAGAMENTO,
        },
        cellStyle: { textAlign: "center" },
        cellRenderer: (params: any) => {
          if (params.data) {
            return (
              <Status data={STATUS_PAGAMENTO} status={params.data.status} />
            );
          }
        },
      });

      setColumns(cols);
      setGridApi(params.api);
    } catch (error) {
      console.error('Grid ready error:', error);
    }
  }, [defaultColumns, isView, isReversedPayment]);

  const onDelete = useCallback(async (row: any) => {
    try {
      setLoading(true);



        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");

        const body = {
          id_operacao_patio_pagamento: row,
          id_usuario_historico: userId,
        };

        await api.post("/operacaopatio/estorno", body);


      setLoading(false);
      setIsRemove(false);
      setUpdate(prev => !prev);
    } catch (error) {
      console.error('Delete payment error:', error);
      setLoading(false);
    }
  }, [selectedRow]);

  /**
   * Handle payment reversal using the new Linx payment integration
   */
  const onPayment = useCallback(async (row: PaymentRowData) => {
    try {
      const paymentMethod = row.tipo_pagamento.toString();
      const amount = row.quantia_paga;

      console.log('Processing payment reversal for row:', row);
      
      // Store the row being processed for the success callback
      setPaymentInProgress(row);
      paymentInProgressRef.current = row;


      // Check if this payment method requires Linx SDK for reversal
      if (row.administrative_code !== null) {

        const request = {
          administrativeCode: row.administrative_code !== null ? row.administrative_code : '',
          amount: String(amount),
          data: '010925'
        };

        // Use the new Linx payment integration for reversal
        await linxPayment.cancelPayments(request);
      } else {
        // For non-card payments, delete directly
        onDelete(row.id_operacao_patio_pagamento);
        // Clear the payment in progress since we're handling it directly
        setPaymentInProgress(null);
      }
    } catch (error) {
      console.error('Payment reversal error:', error);
      // Clear the payment in progress on error
      setPaymentInProgress(null);
    }
  }, [linxPayment, onDelete]);

  useEffect(() => {
    if (gridApi) {
      const dataSource = {
        getRows: async (params: any) => {
          try {
            const page = params.endRow / 100 - 1;

            let currentRow = sessionStorage.getItem("@triagem");

            if (currentRow) {
              setCurrentRow(JSON.parse(currentRow));
            }

            const id_operacao_patio =
              sessionStorage.getItem("id_operacao_patio") ||
              (currentRow ? JSON.parse(currentRow).id_operacao_patio : null);

            const body = {
              id_operacao_patio: Number(id_operacao_patio),
              qtd_por_pagina: 100,
              order_by: "data_historico",
              order_direction: "desc",
            };

            const response = await api.post(
              `/operacaopatio/pagamentos?page=${page + 1}`,
              body
            );

            params.successCallback(response.data.data, response.data.total);
            setRowData(response.data.data);
          } catch (error) {
            console.error('Data loading error:', error);
            params.failCallback();
          }
        },
      };

      gridApi.setDatasource(dataSource);
    }
  }, [gridApi, update]);

  return (
    <div className="overflow-y-scroll w-auto max-h-[calc(80vh)] p-3">
      <Loading loading={loading} />

      {isReversedPayment && (
        <ReversedPayment
          onConfirm={() => {
            setIsReversedPayment(false);
            if (selectedRow) {
              onPayment(selectedRow);
            }
          }}
          onCancel={() => setIsReversedPayment(!isReversedPayment)}
        />
      )}

      {isRemove && (
        <ModalDelete
          title="Deseja estornar o pagamento?"
          message="Por favor, confirme que você deseja estornar o seguinte registro:"
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() => setIsReversedPayment(true)}
          row={selectedRow?.id_operacao_patio_pagamento?.toString()}
        />
      )}

      {isView && selectedRow && (
        <Info
          data={selectedRow}
          title="Conhecer - Pagamentos"
          onClose={() => setIsView(!isView)}
        />
      )}

      {linxPayment.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <span className="block sm:inline">Erro no sistema de pagamento: {linxPayment.error}</span>
          <button
            onClick={linxPayment.resetError}
            className="float-right font-bold text-red-700 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {currentRow && currentRow.status < 11 && (
        <div className="w-full h-full flex justify-end">
          <button
            className="flex items-center justify-center h-10 w-36 bg-[#062D4E] text-[#FFFFFF] text-sm font-light border-none rounded-full"
            onClick={() => setStatus(3)}
          >
            Adicionar <img src={PlusButtonIcon} alt="" className="ml-2" />
          </button>
        </div>
      )}

      <div className="ag-theme-quartz h-96 mt-4">
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columns}
          rowModelType="infinite"
          pagination
          rowSelection={RowSelection.SINGLE}
          onGridReady={onGridReady}
        />
      </div>
    </div>
  );
};

export default ListPayment;