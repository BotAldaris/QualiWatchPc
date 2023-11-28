import { Component, Match, Switch } from "solid-js";
interface IProps {
  validade: Date;
}

const EscolhedorDeIconeValidade: Component<IProps> = (props) => {
  const diasFaltando =
    (props.validade.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return (
    <div class="w-12 grid justify-center ">
      <Switch
        fallback={
          <svg
            class="img"
            fill="green"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>clock</title>
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.9L16.2,16.2Z" />
          </svg>
        }
      >
        <Match when={diasFaltando < 0}>
          <svg
            class="img"
            fill="red"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z" />
          </svg>
        </Match>
        <Match when={30 >= diasFaltando}>
          <svg
            class="img"
            fill="yellow"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M11 7V13L16.2 16.1L17 14.9L12.5 12.2V7H11M20 12V18H22V12H20M20 20V22H22V20H20M18 20C16.3 21.3 14.3 22 12 22C6.5 22 2 17.5 2 12S6.5 2 12 2C16.8 2 20.9 5.4 21.8 10H19.7C18.8 6.6 15.7 4 12 4C7.6 4 4 7.6 4 12S7.6 20 12 20C14.4 20 16.5 18.9 18 17.3V20Z" />
          </svg>
        </Match>
        <Match when={60 >= diasFaltando}>
          <svg
            class="img"
            fill="orange"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path d="M20 12H22V18H20V12M20 20H22V22H20V20M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22C14.3 22 16.3 21.2 18 20V10H21.8C20.9 5.4 16.8 2 12 2M16.2 16.2L11 13V7H12.5V12.2L17 14.9L16.2 16.2Z" />
          </svg>
        </Match>
      </Switch>
    </div>
  );
};

export default EscolhedorDeIconeValidade;
