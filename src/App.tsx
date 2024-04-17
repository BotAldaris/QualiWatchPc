import AppBar from "./components/AppBar";
import { useTema } from "./contexts/TemaContext";

const App = (props: any) => {
  const { tema } = useTema()!;
  return (
    <div class="min-h-screen" data-theme={tema() ? "dark" : "light"}>
      <main class="">
        <article>{props.children}</article>
      </main>
      <footer>
        <AppBar />
      </footer>
    </div>
  );
};

export default App;
