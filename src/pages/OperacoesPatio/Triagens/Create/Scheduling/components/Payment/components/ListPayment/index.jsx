import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { usePaykit } from "../../../../../../../../../hooks/PaykitContext";

const ListPayment = () => {
  const [columns, setColumns] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState();
  const [isView, setIsView] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [currentRow, setCurrentRow] = useState();
  const [isReversedPayment, setIsReversedPayment] = useState(false);

  const defaultColumns = [
    {
      field: "data_hora_pagamento",
      headerName: "Data do pagamento",
      valueFormatter: (params) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }

        return "---";
      },
    },
    {
      field: "tipo_pagamento",
      headerName: "Tipo de pagamento",
      valueFormatter: (params) => {
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
      valueFormatter: (params) => {
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
      cellRenderer: (params) => {
        if (params.data) {
          return (
            <div>
              <button
                className="mr-4"
                onClick={() => {
                  // addBreadcrumb("Conhecer");
                  // props.onView(params.data);
                  setSelectedRow(params.data);
                  setIsView(!isView);
                }}
              >
                <img src={InfoIcon} style={{ width: 16, height: 16 }} />
              </button>
              <button
                onClick={() => {
                  // props.onDelete(params.data);
                  setSelectedRow(params.data);
                  setIsReversedPayment(!isReversedPayment);
                }}
              >
                <img src={DeleteIcon} style={{ width: 16, height: 16 }} />
              </button>
            </div>
          );
        }
      },
    },
  ];

  const authenticatedRef = useRef(false);

  const { setStatus } = useStatus();

  const gridRef = useRef(null);

    const { authenticated, error, reveralPayment } = usePaykit();
  

  const onGridReady = useCallback(async (params) => {
    try {
      console.log("entrou");
      let cols = defaultColumns;

      cols.unshift({
        field: "status",
        fieldName: "status",
        headerName: "Status",
        filter: CustomStatusFilter,
        filterParams: {
          status: STATUS_PAGAMENTO,
        },
        // width: 310,
        cellStyle: { textAlign: "center" },
        // pinned: "left",
        cellRenderer: (params) => {
          if (params.data) {
            return (
              <Status data={STATUS_PAGAMENTO} status={params.data.status} />
            );
          }
        },
      });

      setColumns(cols);

      console.log(cols);

      setGridApi(params.api);
    } catch { }
  }, []);

  const onDelete = useCallback(async (rowId) => {
    try {
      setLoading(true);

      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get("userId");

      const body = {
        id_operacao_patio_pagamento: rowId,
        id_usuario_historico: userId,
      };

      console.log("Passou", body);

      await api.post("/operacaopatio/estorno", body);

      setLoading(false);

      setIsRemove(false);

      setUpdate(false);
      setUpdate(true);
    } catch {
      setLoading(false);
    }
  }, []);

  var checkouts;
  var checkout;
  var authSuccessMessage = 'Autenticado com sucesso.';

  var onPaymentSuccess = function (response, row) {
    console.log(response.receipt.merchantReceipt + '<br>' + response.receipt.customerReceipt);
    console.log(response);

     const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;


    const printWindow = window.open('', '', `width=${screenWidth},height=${screenHeight},top=0,left=0`);
    printWindow.document.write(`<!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <title></title> <!-- Deixe o título vazio -->
        <style>
          body {
            font-family: monospace;
            white-space: pre;
            font-size: 14px;
            margin: 0;
            padding: 20px;
          }

          @media print {
            @page {
              margin: 0;
            }
            body {
              margin: 0;
              padding: 2px;
            }
          }
        </style>
      </head>
      <body>
        <pre>${response.receipt.merchantReceipt}</pre>
      </body>
    </html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();

    onDelete(row.id_operacao_patio_pagamento);
  };
  var onPaymentError = function (error) {
    console.log(error);
    console.log('Código: ' + error.reasonCode + '<br>' + error.reason);

    if (error.reasonCode == 9) {
      checkout = window.PaykitCheckout.undoPayments();
    }
  };

  const creditPayment = (value) => {
    var creditRequest = {
      amount: parseFloat(value),
      requestKey: null,
    };

    if (window.PaykitCheckout) {
      checkout = window.PaykitCheckout.creditPayment(creditRequest, onPaymentSuccess, onPaymentError);
    } else {
      FrontendNotification("Erro ao carregar o SDK Paykit", "error")
    }

  }


  function debitPayment(value) {
    console.log(value);
    const amount = parseFloat(value);
    if (window.PaykitCheckout) {
      checkout = window.PaykitCheckout.debitPayment({ amount: amount }, onPaymentSuccess, onPaymentError);
    } else {
      FrontendNotification("Erro ao carregar o SDK Paykit", "error")
    }
  }

  
  const onPayment = useCallback(async (row) => {
    try {
      const amount = row.quantia_paga;

      console.log(row);
      // Check if this payment method requires Linx SDK for reversal
      if (row.administrative_code !== null) {

        const request = {
          administrativeCode: row.administrative_code !== null ? row.administrative_code : '',
          amount: String(amount),
          data: '010925'
        };

        if(authenticated) {
          reveralPayment(request, (response) => onPaymentSuccess(response, row), (error) => onPaymentError(error))
        }

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
  }, []);


  useEffect(() => {

    if (gridApi) {
      const dataSource = {
        getRows: async (params) => {
          try {
            // Fazer uma requisição ao servidor passando os parâmetros da página
            const page = params.endRow / 100 - 1;

            let currentRow = sessionStorage.getItem("@triagem");

            if (currentRow) {
              currentRow = JSON.parse(currentRow);
            }

            setCurrentRow(currentRow);

            const id_operacao_patio =
              sessionStorage.getItem("id_operacao_patio") ||
              currentRow.id_operacao_patio;

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
          } catch { }
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
            onPayment(selectedRow)
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
          row={selectedRow?.id_operacao_patio_pagamento}
        />
      )}
      {isView && (
        <Info
          data={selectedRow}
          title="Conhecer - Pagamentos"
          onClose={() => setIsView(!isView)}
        />
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