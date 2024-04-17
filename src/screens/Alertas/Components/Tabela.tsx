import { Component, For } from "solid-js";
import IReadProduto from "../../../interfaces/Produtos/ReadProduto";
interface IProps {
  produtos: IReadProduto[];
  recarregar: Function;
}
const Tabela: Component<IProps> = (props) => {
  return (
    <table class="table table-zebra ">
      <thead>
        <tr>
          <th class="text-primary">Nome</th>
          <th class="text-primary">Lote</th>
          <th class="text-primary">Validade</th>
        </tr>
      </thead>
      <tbody>
        <For each={props.produtos}>
          {(produto) => (
            <tr>
              <td>{produto.nome}</td>
              <td>{produto.lote}</td>
              <td>{produto.validade.toLocaleDateString()}</td>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
};

export default Tabela;
