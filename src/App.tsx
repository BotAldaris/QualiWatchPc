import { Route, Routes } from "@solidjs/router";
import { lazy, onMount } from "solid-js";

import AppBar from "./components/AppBar";
import EditarProduto, { ProdutoData } from "./screens/Products/pages/Editar";
import { useTema } from "./contexts/TemaContext";
import { atualizarListaProdutosPertodeVencer } from "./services/Produto";
const Produtos = lazy(() => import("./screens/Products/"));
const AdicionarProduto = lazy(
  () => import("./screens/Products/pages/Adicionar")
);
const Configuracao = lazy(() => import("./screens/Configuracao"));
const Alertas = lazy(() => import("./screens/Alertas"));
function App() {
  onMount(async () => {
    await atualizarListaProdutosPertodeVencer();
  });
  const { tema } = useTema()!;
  return (
    <div class="min-h-screen" data-theme={tema() ? "dark" : "light"}>
      <main class="">
        <article>
          <Routes>
            <Route path="/" component={Produtos} />
            <Route path="/configuracao" component={Configuracao} />
            <Route path="/produtos" component={Produtos} />
            <Route
              path="/produtos/editar/:id"
              component={EditarProduto}
              data={ProdutoData}
            />
            <Route path="/produtos/adicionar" component={AdicionarProduto} />
            <Route path="/alertas" component={Alertas} />
          </Routes>
        </article>
      </main>
      <footer>
        <AppBar />
      </footer>
    </div>
  );
}

export default App;
