import { RouteDataFuncArgs, useRouteData } from "@solidjs/router";
import { Component, Show, createResource } from "solid-js";
import { readProdutoByIdApi } from "../../../../services/Produto";
import ProdutoForm from "../components/ProdutoForm";
import Header from "../components/Header";

export function ProdutoData({ params }: RouteDataFuncArgs) {
  const [produto] = createResource(() => params.id, readProdutoByIdApi);
  return produto;
}

const EditarProduto: Component = () => {
  const produto = useRouteData<typeof ProdutoData>();

  return (
    <>
      <Header nome="Editar" />
      <div class="flex flex-col items-center justify-center gap-4">
        <Show when={produto()} fallback={<p>Caregando...</p>}>
          <ProdutoForm produtoApi={produto()!} editar={true} />
        </Show>
      </div>
    </>
  );
};

export default EditarProduto;
