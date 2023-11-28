import { getListaProdutosPertoDeVencerApi } from "./Produto";
import { Store } from "tauri-plugin-store-api";
const VALIDADE = "validades";
const storeValidade = new Store(".validade.dat");

export async function removerDosAlertas(id: string) {
  let produtos = await getListaProdutosPertoDeVencerApi();
  produtos = produtos.filter((p) => p.id != id);
  storeValidade.set(VALIDADE, produtos);
}

export async function removerTodosOsAlertas() {
  storeValidade.delete(VALIDADE);
}
