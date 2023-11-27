/* @refresh reload */
import { render } from "solid-js/web";
import { Router } from "@solidjs/router";
import "./index.css";
import App from "./App";
import { TemaContextProvider } from "./contexts/TemaContext";

render(
  () => (
    <Router>
      <TemaContextProvider>
        <App />
      </TemaContextProvider>
    </Router>
  ),
  document.getElementById("root") as HTMLElement
);
