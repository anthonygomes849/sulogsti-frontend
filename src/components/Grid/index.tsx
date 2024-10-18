import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { BsCheck, BsInfo, BsSlash, BsX } from "react-icons/bs";
import { Link } from "react-router-dom";
import LoadingIndicator from "../../core/common/Loading";
import api from "../../services/api";
import Badge from "../Badge";
import Loading from "./components/Loading";
import { GridProps } from "./model/Grid";

// import { Container } from './styles';

const Grid: React.FC<GridProps> = (props: GridProps) => {
  const gridRef = useRef<any>(null);
  const [columns] = useState(props.columns);
  const [colDefs, setColDefs] = useState<any>([]);
  const [pagination] = useState(props.pagination);
  const [rowSelection] = useState(props.rowSelection);
  const [path] = useState(props.path);
  const [rowData, setRowData] = useState<any[]>();
  const defaultColumns = [
    {
      field: "status",
      headerName: "Status",
      cellStyle: { textAlign: "center" },
      // pinned: "left",
      cellRenderer: (params: CustomCellRendererProps) => {
        if (params.value) {
          return <Badge content="Ativo" color="#008000" />;
        }
      },
    },
    {
      field: "",
      headerName: "",
      pinned: "right",
      cellRenderer: (params: CustomCellRendererProps) => {
        return (
          <div className="flex w-full h-full items-center justify-center">
            <Link
              to={window.location.pathname + "/conhecer"}
              onClick={() => {
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
              state={{ data: params.data }}
            >
              <BsInfo color="#1eb10d" style={{ width: 24, height: 24 }} />
            </Link>
            <button>
              <BsSlash color="#FFA500" style={{ width: 24, height: 24 }} />
            </button>
            <button
              onClick={() => {
                props.onDelete(params.data.id_veiculo);
              }}
            >
              <BsX color="#FF0000" style={{ width: 24, height: 24 }} />
            </button>
            <button>
              <BsCheck color="#808080" style={{ width: 24, height: 24 }} />
            </button>
          </div>
        );
      },
    },
  ];

  // const [showCrudButtons] = useState(props.showCrudButtons);
  // const [gridApi, setGridApi] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const onGridReady = useCallback(async (params: any) => {
    let cols: any[] = [];

    defaultColumns.forEach((defaultColumn: any) => {
      cols.unshift(defaultColumn);
    });

    columns.forEach((column) => {
      // Realiza a tradução da key.
      if (column.headerName) {
        column.headerName = column.headerName;
      }

      cols.push(column);
    });

    setColDefs(cols);
    // setGridApi(params.api);

    const dataSource = {
      getRows: async (params: any) => {
        setLoading(true);
        // Fazer uma requisição ao servidor passando os parâmetros da página
        const page = params.endRow / 100 - 1;

        // let filters = props.filters;

        // Adiciona os filtros de colunas customizados.
        // if (params.filterModel != null) {
        //   for (const customFilter in params.filterModel) {
        //     // Tem que fazer o teste se é um array, pois caso o receba
        //     // será um filtro por período.
        //     if (Array.isArray(params.filterModel[customFilter].value)) {
        //       let newFilters: any[] = params.filterModel[customFilter].value;
        //       filters = removeFilterByField(filters, newFilters[0].field);

        //       // Adiciona os novos filtros.
        //       for (var i = 0; i < newFilters.length; i++) {
        //         filters.push({
        //           field: newFilters[i].field,
        //           value: newFilters[i].value,
        //           operation: newFilters[i].operation,
        //         });
        //       }
        //     } else {
        //       let newFilter: any = params.filterModel[customFilter].value;
        //       filters = removeFilterByField(filters, newFilter.field);
        //       if (newFilter.value != '') {
        //         filters.push({
        //           field: newFilter.field,
        //           value: newFilter.value,
        //           operation: newFilter.operation,
        //         });
        //       }
        //     }
        //   }
        const reqDTO = {
          qtd_por_pagina: 100,
          order_by: "data_historico",
          order_direction: "desc",
        };

        const response = await api.post(`${path}?page=${page + 1}`, reqDTO);

        params.successCallback(response.data.data, response.data.total);
        setRowData(response.data.data);

        setLoading(false);
      },
    };

    params.api.setDatasource(dataSource);
  }, []);

  const loadingOverlayComponent = useMemo(() => {
    return Loading;
  }, []);

  // useEffect(() => {
  //   console.log(gridApi);
  //   if (gridApi) {
  //     console.log("entrou1");
  //     const datasource = {
  //       getRows: async (params: any) => {

  //       }
  //     };
  //       // gridRef.current.setDatasource(dataSource);
  //   }
  // }, [gridApi]);
  return (
    <div
      className="ag-theme-quartz"
      style={{ width: "100%", height: "calc(100vh - 50px)" }}
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
        // onCellValueChanged={onCellValueChanged}
        // onSelectionChanged={onSelectionChanged}
        // onCellClicked={onCellClicked}
      />
    </div>
  );
};

export default Grid;
