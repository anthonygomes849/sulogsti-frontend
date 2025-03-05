// import { Container } from './styles';
import { useCallback, useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../../../../../../assets/images/logo-sulog-rodape.svg";

import {
  formatDateTimeBR,
  renderCargoTypes,
  renderVehicleTypes,
} from "../../../../../../../../helpers/format";
import api from "../../../../../../../../services/api";
import { IPaymentTicket } from "../types/types";

interface Props {
  data: any;
  onClose: () => void;
}

const Ticket = (props: Props) => {
  const [dataTicket, setDataTicket] = useState<IPaymentTicket[]>([]);
  const printRef: any = useRef(null);

  const handlePrint = () => {
    print();
  };

  const print = useReactToPrint({
    contentRef: printRef,
  });

  const getPaymentTicket = useCallback(async () => {
    try {
      const body = {
        id_operacao_patio: props.data.id_operacao_patio,
      };

      const response = await api.post("/operacaopatio/custoOperacao", body);

      if (response.status === 200) {
        let rows: IPaymentTicket[] = [];
        for (var i = 0; i < 3; i++) {
          rows.push(response.data);
        }
        setDataTicket(rows);

        setTimeout(() => {
          handlePrint();
          
        }, 1000);
      }
    } catch {}
  }, [props.data]);

  useEffect(() => {
    getPaymentTicket();
  }, [getPaymentTicket]);

  return (
    <>
      <div
        ref={printRef}
        className="w-[300px] h-full bg-[#FFF] p-1 ml-2 mt-4"
        id="ticket"
      >
        {dataTicket.length > 0 &&
          dataTicket.map((item: IPaymentTicket) => (
            <div
              className="w-full h-full p-2 flex flex-col items-center justify-center"
              style={{ pageBreakAfter: "always" }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center">
                <img src={Logo} width={140} height={140} />
                <div className="w-full flex items-center justify-center mt-3">
                  <h1 className="text-sm text-[#000] font-bold mr-1">CNPJ:</h1>
                  <span className="text-sm text-[#000] font-bold">
                    11.166.491/0001-61
                  </span>
                </div>
              </div>

              <div
                className="w-full flex flex-col items-center justify-center mt-2 p-4"
                style={{ borderBottom: "2px dashed #000" }}
              >
                <span className="text-sm text-[#000] font-bold">
                  Agendamento:
                </span>
                <span className="text-sm text-[#000] font-bold mt-1">
                  {item.operacaoPatio.operacao_porto_agendada !== null
                    ? formatDateTimeBR(
                        item.operacaoPatio.operacao_porto_agendada
                          .data_agendamento_terminal
                      )
                    : "---"}
                </span>
              </div>
              <div
                className="w-full flex flex-col items-center justify-center p-4"
                style={{ borderBottom: "2px dashed #000" }}
              >
                <span className="text-sm text-[#000] font-bold">
                  Motorista:
                </span>
                <span className="text-sm text-[#000] font-bold mt-1">
                  {item.motorista !== null ? item.motorista.nome : "---"}
                </span>
              </div>
              <div
                className="w-full flex flex-col items-center justify-center mt-3 p-4"
                style={{ borderBottom: "2px dashed #000" }}
              >
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Tipo do Veículo:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_patio_identificacao_veiculo &&
                    item.operacaoPatio.operacao_patio_identificacao_veiculo !==
                      null
                      ? renderVehicleTypes(
                          item.operacaoPatio
                            .operacao_patio_identificacao_veiculo.tipo_veiculo
                        )
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">Placa:</span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_porto_agendada !== null
                      ? item.operacaoPatio.operacao_porto_agendada
                          .placa_dianteira_veiculo
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Transportadora:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_porto_agendada !== null &&
                    item.operacaoPatio.operacao_porto_agendada
                      .transportadora !== null
                      ? item.operacaoPatio.operacao_porto_agendada
                          .transportadora.razao_social
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Terminal:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_porto_agendada !== null &&
                    item.operacaoPatio.operacao_porto_agendada.terminal !== null
                      ? item.operacaoPatio.operacao_porto_agendada.terminal
                          .razao_social
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Tipo Carga:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_porto_agendada !== null &&
                    item.operacaoPatio.operacao_porto_agendada.tipo_carga !==
                      null
                      ? renderCargoTypes(
                          item.operacaoPatio.operacao_porto_agendada.tipo_carga
                        ).replace(",", "")
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Número Container:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.operacao_porto_agendada !== null &&
                    item.operacaoPatio.operacao_porto_agendada
                      .identificadores_conteineres !== null
                      ? item.operacaoPatio.operacao_porto_agendada
                          .identificadores_conteineres
                      : "---"}
                  </span>
                </div>
              </div>
              <div
                className="w-full flex flex-col items-center justify-center mt-3 p-4"
                style={{ borderBottom: "2px dashed #000" }}
              >
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Entrada:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.operacaoPatio.entrada_veiculo !== null
                      ? formatDateTimeBR(
                          item.operacaoPatio.entrada_veiculo.data_hora
                        )
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Pagamento:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    ---
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Tempo de Permanência:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.tempo_permanencia !== null
                      ? item.tempo_permanencia
                      : "---"}
                  </span>
                </div>
                <div className="w-full flex items-center mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Qtd. de Horas Extras:
                  </span>
                  <span className="text-sm text-[#000] font-normal ml-1">
                    {item.qtd_horas_extras !== null
                      ? item.qtd_horas_extras
                      : "---"}
                  </span>
                </div>
              </div>
              <div
                className="w-full flex flex-col items-center justify-center mt-3 p-4"
                style={{ borderBottom: "2px dashed #000" }}
              >
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Triagem:
                  </span>
                  <div
                    className="w-full ml-2 mr-2"
                    style={{ border: "1px dashed #ccc" }}
                  />
                  <span className="text-sm text-[#000] font-bold ml-1 w-full">
                    R$ {Number(item.valor_total_triagem).toFixed(2)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="text-sm text-[#000] font-bold">
                    Estadia:
                  </span>
                  <div
                    className="w-full ml-2 mr-2"
                    style={{ border: "1px dashed #ccc" }}
                  />
                  <span className="text-sm text-[#000] font-bold ml-1 w-full">
                    R$ {Number(item.valor_total_estadia).toFixed(2)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="w-[70%] text-sm text-[#000] font-bold">
                    Valor Pago:
                  </span>
                  <div
                    className="w-full ml-2 mr-2"
                    style={{ border: "1px dashed #ccc" }}
                  />
                  <span className="text-sm text-[#000] font-bold ml-1 w-full">
                    R$ {Number(item.valor_pago).toFixed(2)}
                  </span>
                </div>
                <div className="w-full flex items-center justify-between mb-4">
                  <span className="w-[70%] text-sm text-[#000] font-bold">
                    Falta Pagar:
                  </span>
                  <div
                    className="w-full mr-2"
                    style={{ border: "1px dashed #ccc" }}
                  />
                  <span className="text-sm text-[#000] font-bold ml-1 w-full">
                    R${" "}
                    {item.valor_a_pagar
                      ? Number(item.valor_a_pagar).toFixed(2)
                      : 0}
                  </span>
                </div>

                <div className="w-full flex flex-col items-center justify-between mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Tipo de pagamento:
                  </span>
                  <span className="text-sm text-[#000] font-bold ml-1 flex flex-col">
                    DINHEIRO
                  </span>
                  <span className="text-sm text-[#000] font-bold ml-1 flex flex-col">
                    CRÉDITO
                  </span>
                </div>
              </div>

              <div className="w-full flex flex-col items-center justify-center mt-3 p-4">
                <div className="w-full flex items-center justify-between mb-1">
                  <span className="text-sm text-[#000] font-bold">
                    Operador:
                  </span>
                  <span className="text-sm text-[#000] font-bold ml-1 w-full">
                    ADMINISTRADOR
                  </span>
                </div>

                <div className="mt-6">
                  <span className="max-w-[50%] text-base text-wrap text-[#000] font-bold">
                    DOCUMENTO SEM VALOR FISCAL
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default Ticket;
