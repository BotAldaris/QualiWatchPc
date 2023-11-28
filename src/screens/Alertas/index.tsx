import { Component, Suspense, createResource } from "solid-js";
import Tabela from "./Components/Tabela";
import Header from "./Components/Header";
import { getListaProdutosPertoDeVencer } from "../../services/Produto";

const Alertas: Component = () => {
  const [produtos, { refetch }] = createResource(getListaProdutosPertoDeVencer);
  return (
    <>
      <Header recarregar={refetch} />
      <Suspense fallback={<p>Carregando...</p>}>
        <div class="overflow-x-auto">
          <Tabela produtos={produtos()!} recarregar={refetch} />
        </div>
      </Suspense>
    </>
  );
};

export default Alertas;
