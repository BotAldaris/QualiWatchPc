import { Component } from "solid-js";
import { removerTodosOsAlertas } from "../../../services/Validade";
import { atualizarListaProdutosPertodeVencer } from "../../../services/Produto";

interface IProps {
  recarregar: Function;
}

const Header: Component<IProps> = (props) => {
  async function deletar() {
    await removerTodosOsAlertas();
    await props.recarregar();
  }
  async function sincronizar() {
    await atualizarListaProdutosPertodeVencer();
    await props.recarregar();
  }
  return (
    <header>
      <nav class="navbar bg-base-100">
        <div class="flex-1">
          <h1 class="text-2xl">Alertas</h1>
        </div>
        <div class="flex-none gap-4">
          <button onclick={() => sincronizar()}>
            <svg
              class="w-7 h-7 xl:h-8 xl:w-8 fill-primary"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>sync</title>
              <path d="M12,18A6,6 0 0,1 6,12C6,11 6.25,10.03 6.7,9.2L5.24,7.74C4.46,8.97 4,10.43 4,12A8,8 0 0,0 12,20V23L16,19L12,15M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,13 17.75,13.97 17.3,14.8L18.76,16.26C19.54,15.03 20,13.57 20,12A8,8 0 0,0 12,4Z" />
            </svg>
          </button>
          <button onclick={() => deletar()}>
            <svg
              class="w-7 h-7 xl:h-8 xl:w-8 fill-accent"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>delete-empty</title>
              <path d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19Z" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
