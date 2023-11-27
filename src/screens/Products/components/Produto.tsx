import { Component } from "solid-js";
import IReadProduto from "../../../interfaces/Produtos/ReadProduto";
import { deleteProdutoApi } from "../../../services/Produto";
import { A } from "@solidjs/router";
import EscolhedorDeIconeValidade from "./EscolhedorDeIconeValidade";

interface IProps {
  produto: IReadProduto;
  recarregar: Function;
}

const Produto: Component<IProps> = (props) => {
  const { produto, recarregar } = props;
  const apagarProduto = async () => {
    await deleteProdutoApi(produto.id);
    await recarregar();
  };
  return (
    <div class="card bg-base-300 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">{produto.nome}</h2>
        <p>Lote: {produto.lote}</p>
        <div class="flex justify-between">
          <p>Validade: {produto.validade.toLocaleString().slice(0, 10)}</p>
          <EscolhedorDeIconeValidade validade={produto.validade} />
        </div>
        <div class="card-actions justify-end gap-2">
          <A
            href={`/produtos/editar/${produto.id}`}
            class="btn btn-circle btn-outlined btn-primary"
          >
            <svg
              class="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
          </A>
          <button class="btn btn-circle btn-outlined" onClick={apagarProduto}>
            <svg
              class="img fill-primary"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>delete</title>
              <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produto;
