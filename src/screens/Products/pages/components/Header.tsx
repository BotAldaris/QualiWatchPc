import { A } from "@solidjs/router";
import { Component } from "solid-js";

interface IProps {
  nome: string;
}

const Header: Component<IProps> = (props) => {
  return (
    <header>
      <nav class="navbar bg-base-100 justify-around">
        <div class="flex-1">
          <h1 class="text-2xl">{props.nome} Produto</h1>
        </div>
        <div class="flex-none">
          <A href="/">
            <svg
              class="w-7 h-7 xl:h-8 xl:w-8 fill-accent"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <title>arrow-left</title>
              <path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" />
            </svg>
          </A>
        </div>
      </nav>
    </header>
  );
};

export default Header