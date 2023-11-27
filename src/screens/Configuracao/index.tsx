import { message } from "@tauri-apps/api/dialog";
import { Component, createSignal, onMount } from "solid-js";
import { Store } from "tauri-plugin-store-api";
import { useTema } from "../../contexts/TemaContext";

const Configuracao:Component = () => {
  const store = new Store(".settings.dat");
  const [url, setUrl] = createSignal("");
  const fetchData = async () => {
    const base = await store.get("url");
    setUrl(base as string);
  };
  const { tema, handleTema } = useTema()!;

  onMount(() => {
    fetchData();
  });

  const salvar = async () => {
    try {
      await store.set("url", url());
      await store.save();
      await message("Url Salva com Sucesso");
    } catch (e) {
      await message(`erro ao salvar a url, ${e}`);
    }
  };
  return (
    <div class="grid place-items-center min-h-4/5">
      <h1 class="text-2xl">Configuração</h1>
      <div class=" flex flex-col items-center gap">
        <p>Tema: {tema() ? "Escuro" : "Claro"}</p>
        <input
          type="checkbox"
          class="toggle"
          checked={tema()}
          onchange={() => handleTema()}
        />
      </div>
      <form
        class="flex flex-col gap-2 w-3/5 "
        onsubmit={(e) => {
          e.preventDefault();
          salvar();
        }}
      >
        <div class=" flex flex-col">
          <label for="url">Url</label>
          <input
            class="entrada"
            id="url"
            placeholder="Url"
            type="text"
            value={url()}
            onchange={(e) => setUrl(e.target.value)}
          />
        </div>
        <button class="botao">Enviar</button>
      </form>
    </div>
  );
};

export default Configuracao;
