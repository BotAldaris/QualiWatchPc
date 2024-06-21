import { invoke } from "@tauri-apps/api/core";
import { Component, Setter, createSignal } from "solid-js";
import { storeUrl } from "../../../services/Produto";

interface IProps {
  setValues: Setter<number[]>;
  setLabels: Setter<string[]>;
  setErro: Setter<boolean>;
  setErroMessage: Setter<string>;
  setLabel: Setter<string>;
  setShow: Setter<boolean>;
  setPrimeiraVisita: Setter<boolean>;
}

const Opcoes: Component<IProps> = (props) => {
  const [tipo, setTipo] = createSignal("0");
  const [duracao, setDuracao] = createSignal("1d");
  const [inicio, setInicio] = createSignal<Date>(new Date());
  const [fim, setFim] = createSignal<Date>(new Date());
  const [inicioAtivo, setInicioAtivo] = createSignal<boolean>(false);
  const [fimAtivo, setFimAtivo] = createSignal<boolean>(false);

  async function gerarDados() {
    const base = await storeUrl.get("url");
    props.setPrimeiraVisita(false);
    props.setErro(false);
    props.setShow(false);
    let result = (await invoke("dados_estatisticas", {
      url: base,
      tipo: Number.parseInt(tipo()),
      inicio: inicio().toISOString(),
      fim: fim().toISOString(),
      inicioAtivo: inicioAtivo(),
      fimAtivo: fimAtivo(),
      duracao: duracao(),
    })) as [string[], number[], string];
    if (result[2] != null) {
      props.setErro(true);
      props.setErroMessage(result[2]);
    } else {
      props.setLabels(result[0]);
      props.setValues(result[1]);
      if (tipo() == "0" || tipo() == "1") {
        props.setLabel("Total");
      } else {
        props.setLabel("Média");
      }
      props.setShow(true);
    }
  }
  return (
    <>
      <form
        class="grid md:grid-cols-2 lg:grid-cols-5 sm:grid-cols-1 w-4/5 align-items-center justify-center gap-4"
        onsubmit={async (e) => {
          e.preventDefault();
          await gerarDados();
        }}
      >
        <div>
          <label>Tipo: </label>
          <div class="inputdiv">
            <select class="select" onChange={(it) => setTipo(it.target.value)}>
              <option value={"0"}>Adicionado</option>
              <option value={"1"}>Removido</option>
              <option value={"2"}>Dias em Estoque</option>
              <option value={"3"}>Dias para Ser Removido Após Alerta</option>
            </select>
          </div>
        </div>
        <div>
          <label>Intervalo de Visualização: </label>
          <div class="inputdiv">
            <select
              class="select"
              onChange={(it) => setDuracao(it.target.value)}
            >
              <option value={"1d"}>Dia</option>
              <option value={"7d"}>Semana</option>
              <option value={"1mo"}>Mês</option>
              <option value={"1y"}>Ano</option>
            </select>
          </div>
        </div>
        <div>
          <div>
            <label>Inicio: </label>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Ativo</span>
                <input
                  type="checkbox"
                  checked={inicioAtivo()}
                  class="checkbox"
                  onChange={() => {
                    setInicioAtivo(!inicioAtivo());
                  }}
                />
              </label>
            </div>
          </div>
          <input
            class="entrada max-w-xs"
            type="date"
            disabled={!inicioAtivo()}
            value={inicio().toISOString().split("T")[0]}
            onchange={(e) => {
              setInicio(new Date(e.target.value));
            }}
          />
        </div>
        <div>
          <div>
            <label>Fim: </label>
            <div class="form-control">
              <label class="label cursor-pointer">
                <span class="label-text">Ativo</span>
                <input
                  type="checkbox"
                  checked={fimAtivo()}
                  class="checkbox"
                  onChange={() => {
                    setFimAtivo(!fimAtivo());
                  }}
                />
              </label>
            </div>
          </div>
          <input
            class="entrada max-w-xs"
            type="date"
            disabled={!fimAtivo()}
            value={fim().toISOString().split("T")[0]}
            onchange={(e) => {
              setFim(new Date(e.target.value));
            }}
          />
        </div>
        <button class="botao btn-secondary" type="submit">
          Gerar
        </button>
      </form>
    </>
  );
};

export default Opcoes;
