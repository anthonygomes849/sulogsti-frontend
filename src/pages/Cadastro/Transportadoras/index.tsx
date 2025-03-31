import React, {Fragment, useCallback, useRef, useState} from 'react';
import {ColumnDef} from "../../../components/Grid/model/Grid.ts";
import PlusButtonIcon from "../../../assets/images/PlusButtonIcon.svg";
import Grid from "../../../components/Grid";
import {useModal} from "../../../hooks/ModalContext.tsx";
import {formatDateBR, formatDateTimeBR} from "../../../helpers/format.ts";
import {ITransportadoras} from "./types/types.ts";
import ModalDelete from "../../../components/ModalDelete";
import Info from "./Info";
import api from "../../../services/api.ts";
import Loading from "../../../core/common/Loading";

const Transportadoras: React.FC = () => {
  const [columns] = useState<ColumnDef[]>([
      {
          field: "cnpj",
          headerName: "CNPJ",
          filter: true,
      },
      {
          field: "razao_social",
          headerName: "Razão Social",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "nome_fantasia",
          headerName: "Nome Fantasia",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "faturamento_triagem",
          headerName: "Faturamento Triagem",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return "SIM";
              }
              return "NÃO";
          }
      },
      {
          field: "faturamento_estadia",
          headerName: "Faturamento Estadia",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return "SIM";
              }
              return "NÃO";
          }
      },
      {
          field: "rntrc",
          headerName: "RNTRC",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "data_expiracao_rntrc",
          headerName: "Data Expiração RNTRC",
          filter: true,
          filterParams: {
              dateBetween: true,
          },
          valueFormatter: (params) => {
              if(params.value) {
                  return formatDateBR(params.value);
              }
              return "---";
          }
      },
      {
          field: "endereco",
          headerName: "Endereço",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "complemento",
          headerName: "Complemento",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "numero",
          headerName: "Número",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "bairro",
          headerName: "Bairro",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "cidade",
          headerName: "Cidade",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "uf_estado",
          headerName: "Estado",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "cep",
          headerName: "CEP",
          filter: true,
          valueFormatter: (params) => {
              if(params.value) {
                  return params.value;
              }
              return "---";
          }
      },
      {
          field: "data_historico",
          headerName: "Data de Modificação",
          filter: true,
          filterParams: {
              dateBetween: true,
          },
          valueFormatter: (params) => {
              if (params.value) {
                  return formatDateTimeBR(params.value);
              }
              return "----";
          },
      }
  ]);

  const [isRemove, setIsRemove] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [selectedRow, setSelectedRow] = useState<ITransportadoras>();

  const { openModal } = useModal();
  const gridRef = useRef(null);

  const onDelete = useCallback(async (rowId?: number) => {
      try {
          setLoading(true);

          const body = {
              id_transportadora: rowId,
          };

          await api.post("/deletar/transportadoras", body);

          setIsRemove(false);

          window.location.reload();
      }catch{
          setLoading(false);
      }
  }, [])

  return (
    <Fragment>
        <Loading loading={loading} />

        {isRemove && (
            <ModalDelete
                onCancel={() => setIsRemove(!isRemove)}
                onConfirm={() => onDelete(selectedRow?.id_transportadora)}
                row={selectedRow?.razao_social}
            />
        )}

        {isView && (
            <Info
                data={selectedRow}
                title="Conhecer - Transportadoras"
                onClose={() => setIsView(!isView)}
            />
        )}
        <div className="flex flex-col w-full h-screen bg-[#F5F5F5] p-5">
            <div className="flex items-center justify-between w-full mb-3">
                <div>
                    <h1 className="text-2xl text-[#000000] font-bold">Transportadoras</h1>
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
                    path="/listar/transportadoras"
                    onDelete={(data: ITransportadoras) => {
                        setIsRemove(!isRemove);
                        setSelectedRow(data);
                    }}
                    status={[]}
                    onView={(data: ITransportadoras) => {
                        setSelectedRow(data);
                        setIsView(!isView);
                    }}
                    onUpdate={(data: ITransportadoras) => {
                        setSelectedRow(data);
                        setIsEdit(!isEdit);
                        openModal();
                    }}
                />
            </div>
        </div>
    </Fragment>
  );
}

export default Transportadoras;