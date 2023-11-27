import { Component } from "solid-js";
import IReadProduto from "../../../../interfaces/Produtos/ReadProduto";
import { createStore } from "solid-js/store";
import { putProdutoApi, saveProdutoApi } from "../../../../services/Produto";
import { useNavigate } from "@solidjs/router";
import { message } from "@tauri-apps/api/dialog";

interface IProps {
  produtoApi: IReadProduto;
  editar: boolean;
}

const ProdutoForm: Component<IProps> = (props) => {
  const [produto, setProduto] = createStore(props.produtoApi);
  const navigate = useNavigate();
  async function enviar() {
    try {
      if (produto.lote && produto.nome) {
        if (props.editar) {
          await putProdutoApi(produto, produto.id);
        } else {
          await saveProdutoApi(produto);
        }
        navigate("/");
      }
    } catch (e) {
      message(`${e}`);
    }
  }
  return (
    <form
      class="flex flex-col sm:w-4/5 md:w-3/5 lg:md-2/5 align-items-center justify-center gap-4"
      onsubmit={(e) => {
        e.preventDefault();
        enviar();
      }}
    >
      <div>
        <label>*Nome: </label>
        <div class="inputdiv">
          <input
            type="text"
            class="entrada"
            placeholder="Nome"
            value={produto.nome}
            onchange={(e) => {
              setProduto("nome", e.target.value);
            }}
          />
          {!produto.nome && <p class="text-error">Adicione um Nome</p>}
        </div>
      </div>
      <div>
        <label>Lote: </label>
        <div class="inputdiv">
          <input
            type="text"
            class="entrada"
            placeholder="Lote"
            value={produto.lote}
            onchange={(e) => {
              setProduto("lote", e.target.value);
            }}
          />
          {!produto.lote && <p class="text-error">Adicione um Lote</p>}
        </div>
      </div>
      <div>
        <label>*Validade: </label>
        <div>
          <input
            class="entrada max-w-xs"
            type="date"
            value={produto.validade.toISOString().split("T")[0]}
            onchange={(e) => {
              setProduto("validade", new Date(e.target.value));
              console.log(produto.validade);
            }}
          />
        </div>
      </div>
      <button class="botao btn-secondary" type="submit">
        Salvar
      </button>
    </form>
  );
};

export default ProdutoForm;
