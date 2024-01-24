import { A } from "@solidjs/router";
import { Component } from "solid-js";

const Header: Component = () => {
  return (
    <header>
      <nav class="navbar bg-base-100">
        <div class="flex-1">
          <h1 class="text-2xl">Produto</h1>
        </div>
        <div class="flex-none">
          <A class="btn btn-square btn-ghost" href="/produtos/editar/-1">
            <svg
              class="w-7 h-7 xl:h-8 xl:w-8 fill-accent"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>plus-thick</title>
              <path d="M20 14H14V20H10V14H4V10H10V4H14V10H20V14Z" />
            </svg>
          </A>
        </div>
      </nav>
    </header>
  );
};

export default Header;
