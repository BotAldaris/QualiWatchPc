import { Component, For, Resource, Show } from "solid-js";
import { removerDosAlertas } from "../../../services/Validade";
import IReadProduto from "../../../interfaces/Produtos/ReadProduto";
interface IProps {
  produtos: IReadProduto[];
  recarregar: Function;
}
const Tabela: Component<IProps> = (props) => {
  async function remover(id: string) {
    await removerDosAlertas(id);
    await props.recarregar();
  }

  return (
    <table class="table table-zebra ">
      <thead>
        <tr>
          <th class="text-primary">Nome</th>
          <th class="text-primary">Lote</th>
          <th class="text-primary">Validade</th>
          <th class="text-primary">Apagar</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.produtos}>
          {(produto) => (
            <tr>
              <td>{produto.nome}</td>
              <td>{produto.lote}</td>
              <td>{produto.validade.toLocaleDateString()}</td>
              <td>
                <button
                  class=""
                  onClick={() => {
                    remover(produto.id);
                  }}
                >
                  <svg
                    class="img fill-error"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>delete</title>
                    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                  </svg>
                </button>
              </td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default Tabela;
