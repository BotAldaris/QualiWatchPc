import { Component, Show } from "solid-js";
import { readProdutoByIdApi } from "../../../../services/Produto";
import ProdutoForm from "../components/ProdutoForm";
import Header from "../components/Header";
import { createAsync } from "@solidjs/router";

export function loadProduto({ params } : any) {
  void readProdutoByIdApi(params.id)
}

const AdicionarEditarProduto: Component = (props:any) => {
  const produto = createAsync(() => readProdutoByIdApi(props.params.id))

  return (
    <>
      <Header nome={props.params.id == "-1" ? "Adicionar" : "Editar"} />
      <div class="flex flex-col items-center justify-center gap-4">
        <Show when={produto()} fallback={<p>Caregando...</p>}>
          {props.params.id == "-1" ? <ProdutoForm produtoApi={produto()!} editar={false} /> : <ProdutoForm produtoApi={produto()!} editar={true} />}         
        </Show>
      </div>
    </>
  );
};

export default AdicionarEditarProduto;
