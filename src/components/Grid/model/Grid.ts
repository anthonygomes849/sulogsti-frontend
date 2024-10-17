import { ValueFormatterParams } from "ag-grid-community";
import { CustomCellRendererProps } from "ag-grid-react";

export interface GridProps {
  columns: ColumnDef[];
  pagination: boolean;
  rowSelection?: RowSelection;
  path: string;
  selectedRows?: any[];
  setSelectedRows?: (rows: any[]) => void;
  onUpdate?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  // showCrudButtons: boolean;
  // customButtons?: CustomButtons[];
  filters: Filter[];
  setRowData?: (rows: any[]) => void;
  perPage?: number;
  orders?: Order[];
}

export type ColumnDef = {
  field: string;
  headerName?: string;
  width?: number;
  checkboxSelection?: boolean;
  editable?: boolean;
  filter?: any;
  filterParams?: any,
  valueFormatter?: (params: ValueFormatterParams) => void;
  cellRenderer?: (params: CustomCellRendererProps) => void;
  cellStyle?: any;
  pinned?: string;
}

export enum RowSelection {
  MULTIPLE = "multiple",
  SINGLE = "single"
}

export enum SearchOperation {
  EQUAL = "EQUAL",
  MATCH = "MATCH",
  IN = "IN",
  GREATHER_THAN_EQUAL = "GREATER_THAN_EQUAL",
  LESS_THAN_EQUAL = "LESS_THAN_EQUAL",
  NOT_EQUAL = "NOT_EQUAL"
}

export enum Direction {
  ASC = "ASC",
  DESC = "DESC"
}

export type Filter = {
  field: string;
  value: string | boolean | number | string[];
  operation: SearchOperation;
}

export type Order = {
  field: string;
  direction: Direction;
}