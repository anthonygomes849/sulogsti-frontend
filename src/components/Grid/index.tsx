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
  const { addBreadcrumb } = useBreadcrumb();

  const defaultColumns = [
    {
      field: "",
      headerName: "",
      pinned: "right",
      cellRenderer: (params: CustomCellRendererProps) => {
        console.log(params.data);
        if (params.data) {
          return (
            <div className="flex w-full h-full items-center justify-center">
              {props.customButtons &&
                props.customButtons.map((button: CustomButtons) => {
                  let showButtonStatus = false;
                  if (params.data) {
                    if (button.status.length > 0) {
                      const findButtonStatus = button.status.find(
                        (item) => item == params.data.status
                      );

                      if (findButtonStatus != undefined) {
                        showButtonStatus = true;
                      }
                    }
                  }
                  return (
                    <>
                      {showButtonStatus && (
                        <div
                          className="flex cursor-pointer items-center justify-center h-full mr-4"
                          onClick={() => button.action(params.data)}
                          id={"btnDelete"}
                        >
                          <Tooltip title={button.label}>
                            <img className="w-[22px] h-[22px]" src={button.icon(params.data)} alt="" />
                          </Tooltip>
                        </div>
                      )}
                    </>
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
              {/* {hasPermissions("CONHECER") && (
            )} */}
              {usePermissions("SALVAR") &&
                !window.location.pathname.includes("triagens") && (
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
              {usePermissions("REMOVER") && params.data.status <= 10 && (
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
        }
      },
    },
  ];

  const [loading, setLoading] = useState(false);

  const onGridReady = useCallback(async (params: any) => {
    let cols: any[] = [];

    console.log(params);

    defaultColumns.forEach((defaultColumn: any) => {
      cols.unshift(defaultColumn);
    });

    if (props.isShowStatus) {
      cols.unshift({
        field: "status",
        fieldName: "status",
        headerName: "Status",
        filter: CustomStatusFilter,
        filterParams: {
          status: props.status,
        },
        // width: 310,
        cellStyle: { textAlign: "center" },
        // pinned: "left",
        cellRenderer: (params: CustomCellRendererProps) => {
          if (params.data) {
            return <Status data={props.status} status={params.data.status} />;
          }
        },
      });
    }

    columns.forEach((column) => {
      // Realiza a tradução da key.
      if (column.headerName) {
        column.headerName = column.headerName;
      }

      if (column.filter) {
        column.filter = CustomFilter;
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

          // Adiciona os filtros de colunas customizados.
          if (params.filterModel != null) {
            console.log(params);
            for (const customFilter in params.filterModel) {
              // Tem que fazer o teste se é um array, pois caso o receba
              // será um filtro por período.
              let newFilter: any = params.filterModel[customFilter];

              console.log(newFilter);

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
              } 
              else {
                console.log(newFilter.field);
                let field = newFilter.field;
                // if(new === "placa_dianteira_veiculo" || customFilter === "placa_traseira_veiculo") {
                //   field = "placa";
                // }

                const vauleFilter =
                  field === "status"
                    ? Number(newFilter.value)
                    : newFilter.value;

                filters[`${field}`] = newFilter.filter || vauleFilter;
                console.log(filters);
              }
            }
          }

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

          params.successCallback(response.data.data, response.data.total);
          setRowData(response.data.data);

          setLoading(false);
        } catch {
          setLoading(false);
        }
      },
    };

    // params.api.setGridOption('datasource', dataSource)

    params.api.sizeColumnsToFit();

    params.api.setDatasource(dataSource);

    // setGridApi(params.api);
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return Loading;
  }, []);

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
        rowSelection={rowSelection}
        loadingOverlayComponent={loadingOverlayComponent}
        loadingCellRenderer={loadingOverlayComponent}
        onGridReady={onGridReady}
      />
    </div>
  );
};

export default Grid;
