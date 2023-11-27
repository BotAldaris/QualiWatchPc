import {
  Accessor,
  Component,
  JSX,
  createContext,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import { Store } from "tauri-plugin-store-api";

interface IProps {
  children: JSX.Element;
}
interface ITemaContext {
  tema: Accessor<boolean>;
  handleTema: Function;
}
const TemaContext = createContext<ITemaContext>();

export const TemaContextProvider: Component<IProps> = (props) => {
  const [tema, setTemas] = createSignal(true);

  const store = new Store(".settings.dat");

  const pegaTema = async () => {
    let boo = await store.get<boolean>("tema");
    if (boo === null) {
      boo = true;
    }
    setTemas(boo);
  };

  onMount(() => {
    pegaTema();
  });

  const handleTema = async () => {
    setTemas(!tema());
    await store.set("tema", tema());
    await store.save();
  };

  return (
    <TemaContext.Provider value={{ tema, handleTema }}>
      {props.children}
    </TemaContext.Provider>
  );
};

export function useTema() {
  return useContext(TemaContext);
}
