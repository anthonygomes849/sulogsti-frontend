import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
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
import { CustomButtons, GridProps } from "./model/Grid";
import { Tooltip } from "@mui/material";
import CustomFilter from "./components/CustomFilter";
import CustomStatusFilter from "./components/CustomStatusFilter";
import "./styles.css";

const Grid: React.FC<GridProps> = (props: GridProps) => {
  const gridRef = useRef<any>(null);
  const [columns] = useState(props.columns);
  const [colDefs, setColDefs] = useState<any>([]);
  const [pagination] = useState(props.pagination);
  const [rowSelection] = useState(props.rowSelection);
  const [path] = useState(props.path);
  const [rowData, setRowData] = useState<any[]>();
  const [pageSize, setPageSize] = useState(20);
  const { addBreadcrumb } = useBreadcrumb();
  const [loading, setLoading] = useState(false);

  const defaultColumns = [
    {
      field: "",
      headerName: "",
      pinned: "right",
      cellRenderer: (params: CustomCellRendererProps) => {
        if (!params.data) return null;
        return (
          <div className="flex w-full h-full items-center justify-center">
            {props.customButtons &&
              props.customButtons.map((button: CustomButtons) => {
                let showButtonStatus = false;
                if (button.status.length > 0) {
                  const findButtonStatus = button.status.find(
                    (item) => item == params.data.status
                  );
                  if (findButtonStatus != undefined) {
                    showButtonStatus = true;
                  }
                }
                return (
                  <React.Fragment key={button.label}>
                    {showButtonStatus && (
                      <div
                        className="flex cursor-pointer items-center justify-center h-full mr-4"
                        onClick={() => button.action(params.data)}
                        id={"btnDelete"}
                      >
                        <Tooltip title={button.label}>
                          <img
                            className="w-[22px] h-[22px]"
                            src={button.icon(params.data)}
                            alt=""
                          />
                        </Tooltip>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
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
            {usePermissions("SALVAR") &&
              !window.location.pathname.includes("triagens") && (
                <button
                  className="mr-4"
                  onClick={() => {
                    addBreadcrumb("Editar");
                    props.onUpdate(params.data);
                  }}
                >
                  <img src={EditIcon} style={{ width: 16, height: 16 }} />
                </button>
              )}
            {usePermissions("REMOVER") && params.data.status <= 10 && (
              <button onClick={() => props.onDelete(params.data)}>
                <img src={DeleteIcon} style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const loadingOverlayComponent = useMemo(() => Loading, []);

  const onGridReady = useCallback(
    (params: any) => {
      gridRef.current = params.api;

      // Monta colunas
      let cols: any[] = [];
      defaultColumns.forEach((defaultColumn: any) => {
        cols.unshift(defaultColumn);
      });

      if (props.isShowStatus) {
        cols.unshift({
          field: "status",
          fieldName: "status",
          headerName: "Status",
          filter: CustomStatusFilter,
          filterParams: { status: props.status },
          cellStyle: { textAlign: "center" },
          cellRenderer: (params: CustomCellRendererProps) => {
            if (params.data) {
              return <Status data={props.status} status={params.data.status} />;
            }
          },
        });
      }

      columns.forEach((column) => {
        if (column.headerName) {
          column.headerName = column.headerName;
        }
        if (column.filter) {
          column.filter = CustomFilter;
        }
        cols.push(column);
      });

      setColDefs(cols);

      // Datasource
      const dataSource = {
        getRows: async (gridParams: any) => {
          try {
            setLoading(true);
            console.log(gridParams);
            const pageSize = gridParams.endRow - gridParams.startRow; 
            console.log(pageSize);
            const page = Math.floor(gridParams.startRow / pageSize) + 1;
            let filters: any = {};

            if (gridParams.filterModel != null) {
              for (const customFilter in gridParams.filterModel) {
                let newFilter: any = gridParams.filterModel[customFilter];
                if (newFilter.field === "data_historico") {
                  if (newFilter.value.length > 0) {
                    filters["data_inicial"] = newFilter.value[0];
                    filters["data_final"] = newFilter.value[1];
                  }
                } else if (newFilter.field.includes("data")) {
                  if (newFilter.value.length > 0) {
                    filters[`${newFilter.field}1`] = newFilter.value[0];
                    filters[`${newFilter.field}2`] = newFilter.value[1];
                  }
                } else {
                  let field = newFilter.field;
                  const valueFilter =
                    field === "status"
                      ? Number(newFilter.value)
                      : newFilter.value;
                  filters[`${field}`] = newFilter.filter || valueFilter;
                }
              }
            }

            const reqDTO = {
              qtd_por_pagina: pageSize,
              order_by:
                gridParams.sortModel.length > 0
                  ? gridParams.sortModel[0].colId.replace(
                      "uf_estado",
                      "id_estado"
                    )
                  : "data_historico",
              order_direction:
                gridParams.sortModel.length > 0
                  ? gridParams.sortModel[0].sort
                  : "desc",
              ...filters,
            };

            const response = await api.post(
              `${path}?page=${page}`,
              reqDTO
            );

            gridParams.successCallback(
              response.data.data,
              response.data.total
            );
            setRowData(response.data.data);
            setLoading(false);
          } catch {
            setLoading(false);
          }
        },
      };

      params.api.setDatasource(dataSource);

      // Escuta quando o tamanho de página muda
      params.api.addEventListener("paginationChanged", () => {
        const newSize = params.api.paginationGetPageSize();
        if (newSize !== pageSize) {
          setPageSize(newSize);
           // força getRows com novo tamanho
        }
      });
    },
    [pageSize]
  );

  return (
    <div
      className="ag-theme-quartz bg-[#FFFFFF] max-w-[96%] rounded-lg p-3 mr-5 shadow-md"
      style={{ width: "100%", height: "calc(100vh - 120px)" }}
    >
      <LoadingIndicator loading={loading} />

      <AgGridReact
        ref={gridRef}
        rowData={rowData}
        columnDefs={colDefs}
        rowModelType="infinite"
        pagination={pagination}
        paginationPageSize={pageSize}
        cacheBlockSize={pageSize}
        rowSelection={rowSelection}
        loadingOverlayComponent={loadingOverlayComponent}
        loadingCellRenderer={loadingOverlayComponent}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default Grid;