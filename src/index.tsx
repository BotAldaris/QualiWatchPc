/* @refresh reload */
import { render } from "solid-js/web";
import { Navigate, Route, Router } from "@solidjs/router";
import "./index.css";
import App from "./App"
import { TemaContextProvider } from "./contexts/TemaContext";
import { lazy } from "solid-js";
import { loadProduto } from "./screens/Products/pages/AdicionarEditar";

const Produtos = lazy(() => import("./screens/Products/"));
const Configuracao = lazy(() => import("./screens/Configuracao"));
const Alertas = lazy(() => import("./screens/Alertas"));
const EditarProduto = lazy(() => import("./screens/Products/pages/AdicionarEditar"))
const Estatistica = lazy(() => import("./screens/Estatisticas"))
render(
  () => (
  <TemaContextProvider>
    <Router root={App}>
            <Route path="/" component={() => <Navigate href={"/produtos"}/>}  />
            <Route path="/configuracao" component={Configuracao} />
            <Route path="/produtos" component={Produtos} />
            <Route
              path="/produtos/editar/:id"
              component={EditarProduto}
              load={loadProduto}
            />
            <Route path="/alertas" component={Alertas} />
            <Route path="/estatisticas" component={Estatistica}/>
    </Router>
      </TemaContextProvider>
  ),
  document.getElementById("root") as HTMLElement
);
