import { ValueFormatterParams } from "ag-grid-community";
import React, { useState } from "react";

import Grid from "../../../../../components/Grid";
import { ColumnDef } from "../../../../../components/Grid/model/Grid";

// import { Container } from './styles';

const ListVeiculo: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
    {
      field: "placa",
      headerName: "Placa",
      cellStyle: { textAlign: "left", marginLeft: '1rem' },
      filter: true,
    },
    {
      field: "uf_estado",
      headerName: "Estado",
      cellStyle: { textAlign: "left" },
    },
    {
      field: "tipo_parte_veiculo",
      headerName: "Motorizado",
      cellStyle: { textAlign: "left" },
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: "renavam",
      headerName: "RENAVAM",
      cellStyle: { textAlign: "left" },
    },
    {
      field: 'rntrc',
      headerName: 'RNTRC'
    },
    {
      field: 'data_expiracao_rntrc',
      headerName: 'Expiraçao do RNTRC'
    },
    {
      field: 'ano_exercicio_crlv',
      headerName: 'Ano de Exercício do CRLV'
    },
    {
      field: 'livre_acesso_patio',
      headerName: 'Livre Acesso ao Pátio',
      valueFormatter: (params: ValueFormatterParams) => {
        if (params.value) {
          return "SIM";
        }
        return "NÃO";
      },
    },
    {
      field: 'data_inativacao',
      headerName: 'Data Inativação',
    },
    {
      field: 'dias_inativacao',
      headerName: 'Dias de Inativação'
    },
    {
      field: 'motivo_inativacao',
      headerName: 'Motivo da Inativação'
    },
    {
      field: 'data_historico',
      headerName: 'Data de Modificação'
    },
  ]);

  return (
    <div className="flex flex-col w-full h-screen">


      <div className="flex w-screen">
        <Grid
          columns={columns}
          filters={[]}
          pagination
          path="/listar/veiculos"
        />
      </div>
    </div>
  );
};

export default ListVeiculo;
