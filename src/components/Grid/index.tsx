import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { format } from "date-fns";
import React, { useCallback, useMemo, useRef, useState } from "react";
import DeleteIcon from "../../assets/images/deleteIcon.svg";
import EditIcon from "../../assets/images/editIcon.svg";
import InfoIcon from "../../assets/images/infoIcon.svg";
import LoadingIndicator from "../../core/common/Loading";
import { useBreadcrumb } from "../../hooks/BreadCrumbContext";
import { usePermissions } from "../../hooks/PermissionContext";
import api from "../../services/api";
import Loading from "./components/Loading";
import Status from "./components/Status";
import { GridProps } from "./model/Grid";

import "./styles.css";

const Grid: React.FC<GridProps> = (props: GridProps) => {
  const gridRef = useRef<any>(null);
  const [columns] = useState(props.columns);
  const [colDefs, setColDefs] = useState<any>([]);
  const [pagination] = useState(props.pagination);
  const [rowSelection] = useState(props.rowSelection);
  const [path] = useState(props.path);
  const [rowData, setRowData] = useState<any[]>();
  const { addBreadcrumb } = useBreadcrumb();

  const defaultColumns = [
    {
      field: "",
      headerName: "",
      pinned: "right",
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="flex w-full h-full items-center justify-center">
            {usePermissions("CONHECER") && (
              <button
                className="mr-4"
                onClick={() => {
                  addBreadcrumb("Conhecer");
                  props.onView(params.data);
                }}
              >
                <img src={InfoIcon} style={{ width: 16, height: 16 }} />
              </button>
            )}
            {/* {hasPermissions("CONHECER") && (
            )} */}
            {usePermissions("SALVAR") && (
              <>
                <button
                  className="mr-4"
                  onClick={() => {
                    addBreadcrumb("Editar");
                    props.onUpdate(params.data);
                  }}
                >
                  <img src={EditIcon} style={{ width: 16, height: 16 }} />
                </button>
              </>
            )}
            {usePermissions("REMOVER") && (
              <button
                onClick={() => {
                  props.onDelete(params.data);
                }}
              >
                <img src={DeleteIcon} style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const [loading, setLoading] = useState(false);

  const onGridReady = useCallback(async (params: any) => {
    let cols: any[] = [];

    defaultColumns.forEach((defaultColumn: any) => {
      cols.unshift(defaultColumn);
    });

    if (props.isShowStatus) {
      cols.unshift({
        field: "status",
        headerName: "Status",
        cellStyle: { textAlign: "center" },
        // pinned: "left",
        cellRenderer: (params: CustomCellRendererProps) => {
          if (params.value) {
            return <Status data={props.status} status={params.value} />;
          }
        },
      });
    }

    columns.forEach((column) => {
      // Realiza a tradução da key.
      if (column.headerName) {
        column.headerName = column.headerName;
      }

      cols.push(column);
    });

    setColDefs(cols);

    const dataSource = {
      getRows: async (params: any) => {
        try {
          setLoading(true);
          // Fazer uma requisição ao servidor passando os parâmetros da página
          const page = params.endRow / 100 - 1;

          let filters: any = {};

          console.log("Params", params);

          // Adiciona os filtros de colunas customizados.
          if (params.filterModel != null) {
            for (const customFilter in params.filterModel) {
              console.log("Params2", params.filterModel[customFilter]);
              // Tem que fazer o teste se é um array, pois caso o receba
              // será um filtro por período.

              let newFilter: any = params.filterModel[customFilter];

              if (customFilter === "data_historico") {
                if (newFilter.dateFrom.length > 0) {
                  filters["data_inicial"] = newFilter.dateFrom;
                }

                if (newFilter.dateTo !== null && newFilter.dateTo.length > 0) {
                  filters["data_final"] = newFilter.dateTo.replace(
                    "00:00:00",
                    "23:59:59"
                  );
                } else {
                  filters["data_final"] = `${format(
                    new Date(),
                    "yyyy-MM-dd"
                  )} 23:59:59`;
                }
              } else {
                filters[`${customFilter}`] = newFilter.filter;
              }
            }
          }

          console.log("Filters", filters);

          const reqDTO = {
            qtd_por_pagina: 100,
            order_by:
              params.sortModel.length > 0
                ? params.sortModel[0].colId.replace("uf_estado", "id_estado")
                : "data_historico",
            order_direction:
              params.sortModel.length > 0 ? params.sortModel[0].sort : "desc",
            ...filters,
          };

          const response = await api.post(`${path}?page=${page + 1}`, reqDTO);

          console.log(response.data);

          params.successCallback(response.data.data, response.data.total);
          setRowData(response.data.data);

          setLoading(false);
        } catch {
          setLoading(false);
        }
      },
    };

    // params.api.setGridOption('datasource', dataSource)

    params.api.setDatasource(dataSource);

    // setGridApi(params.api);
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return Loading;
  }, []);

  return (
    <div
      className="ag-theme-quartz bg-[#FFFFFF] max-w-[96%] rounded-lg p-5 mr-5 shadow-md"
      style={{ width: "100%", height: "calc(100vh - 150px)" }}
    >
      <LoadingIndicator loading={loading} />

      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        rowModelType="infinite"
        pagination={pagination}
        rowSelection={rowSelection}
        loadingOverlayComponent={loadingOverlayComponent}
        loadingCellRenderer={loadingOverlayComponent}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default Grid;
