import {onMount } from "solid-js";
import AppBar from "./components/AppBar";
import { useTema } from "./contexts/TemaContext";
import { atualizarListaProdutosPertodeVencer } from "./services/Produto";


const App = (props:any) =>  {
  onMount(async () => {
    await atualizarListaProdutosPertodeVencer();
  });
  const { tema } = useTema()!;
  return (
    <div class="min-h-screen" data-theme={tema() ? "dark" : "light"}>
      <main class="">
        <article>
            {props.children}
        </article>
      </main>
      <footer>
        <AppBar />
      </footer>
    </div>
  );
}

export default App;
