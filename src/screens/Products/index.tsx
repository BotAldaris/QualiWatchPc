import { Component, For, Show, createResource, createSignal } from "solid-js";
import { readProduto } from "../../services/Produto";
import Produto from "./components/Produto";
import Header from "./components/Header";

const Produtos: Component = () => {
  const [produtos, { refetch }] = createResource(readProduto);
  const [searchQuery, setSearchQuery] = createSignal("");

  function pegarDados() {
    return produtos()?.filter((p) =>
      p.nome.toLowerCase().includes(searchQuery().toLowerCase())
    );
  }
  return (
    <>
      <Header />
      <div class="flex w-full justify-center">
        <input
          type="text"
          placeholder="Pesquisar"
          class="input input-bordered w-full max-w-xs input-info"
          value={searchQuery()}
          oninput={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 3xl:grid-cols-4 gap-4 gas">
        <Show when={pegarDados()} fallback={<p>Carregando...</p>}>
          {(p) => (
            <For each={p()}>
              {(produto) => <Produto produto={produto} recarregar={refetch} />}
            </For>
          )}
        </Show>
      </div>
    </>
  );
};

export default Produtos;
