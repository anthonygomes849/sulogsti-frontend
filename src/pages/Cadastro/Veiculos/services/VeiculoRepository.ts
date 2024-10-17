import Veiculo from "../model/Veiculo";

export default interface VeiculosDataSource {
  getVeiculos(): Promise<Veiculo[]>;
}