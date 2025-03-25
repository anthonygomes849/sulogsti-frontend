import React, { useCallback, useRef, useState } from "react";
import "./styles.css";
// import { Container } from './styles';
import { ValueFormatterParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
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

const ListPayment: React.FC = () => {
  const [columns, setColumns] = useState<any[]>([]);
  const [rowData, setRowData] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>();
  const [isView, setIsView] = useState<boolean>(false);
  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [update, setUpdate] = useState<boolean>(false);
  const [gridApi, setGridApi] = useState<any>();

  const defaultColumns = [
    {
      field: "data_hora_pagamento",
      headerName: "Data do pagamento",
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return formatDateTimeBR(params.value);
        }

        return "---";
      },
    },
    {
      field: "tipo_pagamento",
      headerName: "Tipo de pagamento",
      valueFormatter: (params: ValueFormatterParams) => {
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
      valueFormatter: (params: ValueFormatterParams) => {
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
      cellRenderer: (params: CustomCellRendererProps) => {
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
                  setIsRemove(!isRemove);
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

  const { setStatus } = useStatus();

  const gridRef: any = useRef(null);

  const onGridReady = useCallback(async (params: any) => {
    try {
      console.log("entrou");
      let cols: any[] = defaultColumns;

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
        cellRenderer: (params: CustomCellRendererProps) => {
          if (params.data) {
            return (
              <Status data={STATUS_PAGAMENTO} status={params.data.status} />
            );
          }
        },
      });

      setColumns(cols);

      console.log(cols);

      const dataSource = {
        getRows: async (params: any) => {
          try {
            // Fazer uma requisição ao servidor passando os parâmetros da página
            const page = params.endRow / 100 - 1;

            let currentRow: any = sessionStorage.getItem("@triagem");

            if (currentRow) {
              currentRow = JSON.parse(currentRow);
            }

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
          } catch {}
        },
      };

      // params.api.setGridOption('datasource', dataSource)

      params.api.sizeColumnsToFit();

      params.api.setDatasource(dataSource);

      setGridApi(params.api);
    } catch {}
  }, [update]);

  const onDelete = useCallback(async (rowId?: number) => {
    try {
      setLoading(true);

        const urlParams = new URLSearchParams(window.location.search);
        const userId = urlParams.get("userId");

        const body = {
          id_operacao_patio_pagamento: rowId,
          id_usuario_historico: userId
        };

        await api.post("/operacaopatio/estorno", body);

        setLoading(false);

        setIsRemove(false);

        setUpdate(true);

        setUpdate(false);

        onGridReady({ api: gridApi });


    } catch {
      setLoading(false);
    }
  }, []);

  return (
    <div className="overflow-y-scroll w-auto max-h-[calc(80vh)] p-3">
      <Loading loading={loading} />

      {isRemove && (
        <ModalDelete
          onCancel={() => setIsRemove(!isRemove)}
          onConfirm={() =>
            onDelete(selectedRow?.id_operacao_patio_pagamento)
          }
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
      <div className="w-full h-full flex justify-end">
        <button
          className="flex items-center justify-center h-10 w-36 bg-[#062D4E] text-[#FFFFFF] text-sm font-light border-none rounded-full"
          onClick={() => setStatus(3)}
        >
          Adicionar <img src={PlusButtonIcon} alt="" className="ml-2" />
        </button>
      </div>
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
