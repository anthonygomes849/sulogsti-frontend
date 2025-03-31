export interface ITransportadoras {
    id_transportadora: number;
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    rntrc: string;
    data_expiracao_rntrc: string;
    id_przpgto: number;
    periodo_faturamento: number;
    faturamento_triagem: boolean;
    faturamento_estadia: boolean;
    telefone: string;
    celular: string;
    endereco: string;
    complemento: string;
    numero: string;
    bairro: string;
    cidade: string;
    id_bairro: string;
    id_cidade: string;
    uf_estado: string;
    id_estado: string;
    cep: string;
    email: string;
    contato: string;
    data_historico: string;
    ativo: boolean;
}