export const STATUS_VEICULO = [
  {
    id: 0,
    label: 'Ativo',
    color: '#008000',
    icon: '#008000',
  },
  {
    id: 1,
    label: 'Alerta',
    color: '#FFA500',
    icon: '#FFA500',
  },
  {
    id: 2,
    label: 'Erro',
    color: '#FF0000'
  },
  {
    id: 3,
    label: 'Suspenso',
    color: '#C0C0C0'
  },
  {
    id: 4,
    label: 'Inativo',
    color: '#C0C0C0'
  }
];

export const STATUS_MOTORISTA = [
  {
    id: 0,
    label: 'Ativo',
    color: '#008000',
  },
  {
    id: 1,
    label: 'Alerta',
    color: '#FFA500'
  },
  {
    id: 2,
    label: 'Erro',
    color: '#FF0000'
  },
  {
    id: 3,
    label: 'Suspenso',
    color: '#C0C0C0'
  },
  {
    id: 4,
    label: 'Inativo',
    color: '#C0C0C0'
  }
];

export const STATUS_OPERACOES_PORTO_AGENDADA = [
  { id: 0, label: "Programado", color: "#9c7765", icon: "#614639" },
  { id: 1, label: "Alerta", color: "#edbc61", icon: "#ffa500" },
  { id: 2, label: "Incompleto", color: "#bf4b4b", icon: "#ff0000" },
  { id: 3, label: "Entrou no Pátio", color: "#bf4b4b", icon: "#ff0000" },
  { id: 4, label: "Associado", color: "#9c7765", icon: "#614639" },
  { id: 5, label: "Ativo", color: "#81eb81", icon: "#00ff00" },
  { id: 6, label: "Chamado", color: "#7272f2", icon: "#0000ff" },
  { id: 7, label: "Saiu do Pátio", color: "#9c7765", icon: "#614639" },
  { id: 8, label: "Finalizado", color: "#9c7765", icon: "#614639" },
  { id: 9, label: "Inativo", color: "#c7c1c1", icon: "#736f6f" },
];

export const STATUS_OPERACOES_PATIO_TRIAGEM = [
  { id: 0, label: "Entrou no Pátio", color: "#bf4b4b", icon: "#ff0000" },
  { id: 1, label: "Check In - Veículo Associado", color: "#c4643f", icon: "#c1491a" },
  { id: 2, label: "Check In - Aguardando Chamada", color: "#ed916d", icon: "#e3622f" },
  { id: 3, label: "Check In - Chamada", color: "#f5be5b", icon: "#FFA500" },
  {
    id: 4, label: "Check In - Identificação Motorista",
    color: "#fce16d",
    icon: "#ffce00",
  },
  {
    id: 5, label: "Check In - Identificação Veículo",
    color: "#c3c7bd",
    icon: "#a3b18a",
  },
  { id: 6, label: "Check In - Triagem Associada", color: "#a56dcf", icon: "#4B0082" },
  { id: 7, label: "Check In - Aguardando Operação", color: "#8ca0a8", icon: "#7493a0" },
  { id: 8, label: "Check In - Autorizada", color: "#8aba9d", icon: "#49b675" },
  { id: 9, label: "Check In - Não Autorizada", color: "#47a859", icon: "#106b21" },
  { id: 10, label: "Check Out - Chamada Pagamento", color: "#b3cee3", icon: "#8bb9dd" },
  { id: 11, label: "Check Out - Pago", color: "#b0b9eb", icon: "#788bfa" },
  { id: 12, label: "Check Out - Comunicação Porto", color: "#dab9f0", icon: "#a883c0" },
  { id: 13, label: "Check Out - Chamada Para Porto", color: "#af5fed", icon: "#6c3497" },
  { id: 14, label: "Saiu do Pátio", color: "#9c7765", icon: "#614639" },
  { id: 15, label: "Check Out - Pago Estadia", color: "#06568f", icon: "#003459" },
  { id: 16, label: "Check In - Estadia", color: "#83e6ab", icon: "#49b675" },
];

export const STATUS_OPERACAO_PATIO_SERVICOS = [
  {
    id: 1,
    label: 'Entrou no Pátio',
    color: '#FF84AC',
    icon: "#DC0000"
  },
  {
    id: 2,
    label: 'Saiu do Pátio',
    color: '#9A9A9A',
    icon: "#676767"
  },
];