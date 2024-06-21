import { Component, Show, createSignal } from "solid-js";
import Header from "./components/Header";
import Opcoes from "./components/Opcoes";
import BarChart from "./components/BarGraph";

const Estatistica: Component = () => {
  const [show, setShow] = createSignal<boolean>(false);
  const [erro, setErro] = createSignal<boolean>(false);
  const [primeiraVisita, setPrimeiraVisita] = createSignal<boolean>(true);
  const [erroMessage, setErroMessage] = createSignal<string>("");
  const [values, setValues] = createSignal<number[]>([]);
  const [labels, setLabels] = createSignal<string[]>([]);
  const [label, setLabel] = createSignal<string>("");
  return (
    <>
      <Header />
      <div class="flex w-full justify-center flex-col items-center">
        <Opcoes
          setLabels={setLabels}
          setValues={setValues}
          setErro={setErro}
          setErroMessage={setErroMessage}
          setShow={setShow}
          setLabel={setLabel}
          setPrimeiraVisita={setPrimeiraVisita}
        />
        <Show
          when={!primeiraVisita()}
          fallback={<p>Click em gerar, para criar um gráfico </p>}
        >
          <Show
            when={!erro()}
            fallback={<p>Erro ao Gerar o Gráfico: {erroMessage()}</p>}
          >
            <Show when={show()} fallback={<p>Gerando o Gráfico</p>}>
              <BarChart data={values()} labels={labels()} label={label()} />
            </Show>
          </Show>
        </Show>
      </div>
    </>
  );
};
export default Estatistica;
