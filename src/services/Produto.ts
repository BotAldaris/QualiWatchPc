import { fetch } from "@tauri-apps/plugin-http";
import IReadProduto from "../interfaces/Produtos/ReadProduto";
import ICreateProduto from "../interfaces/Produtos/CreateProduto";
import IReadProdutoApi from "../interfaces/Produtos/ReadProdutoApi";
import { Store } from "@tauri-apps/plugin-store";

export const storeUrl = new Store(".settings.dat");

const baseUrl = async () => {
  const base = await storeUrl.get("url");
  if (!base) {
    throw new Error("registre uma url");
  }
  const result = `${base}/api/Produtos`;
  return result;
};
export async function readProduto(): Promise<IReadProduto[]> {
  try {
    const base = await baseUrl();
    const response = await fetch(base);
    if (!response.ok) {
      throw new Error("erro status: " + response.status);
    }
    const produtoSemDataFormatada =
      (await response.json()) as IReadProdutoApi[];
    const result = converterApiparaProduto(produtoSemDataFormatada);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Erro ao pegar os produtos, erro: " + e);
  }
}
export async function readProdutoByIdApi(id: string): Promise<IReadProduto> {
  if (id == "-1") {
    const produto = {
      nome: "",
      lote: "",
      id: "-1",
      validade: new Date(),
    };
    return produto;
  }
  try {
    const base = await baseUrl();
    let s = base + "/" + id;
    const response = await fetch(s);
    if (response.status > 300) {
      throw new Error("erro status: " + response.status);
    }
    const produto = (await response.json()) as IReadProdutoApi;
    const novoProduto = {
      ...produto,
      validade: new Date(produto.validade),
    };
    return novoProduto;
  } catch (e) {
    console.log(e);
    throw new Error("Erro ao pegar os produtos, erro: " + e);
  }
}
export async function saveProdutoApi(produto: ICreateProduto) {
  try {
    const base = await baseUrl();
    const body = JSON.stringify(produto);
    const response = await fetch(base, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(
        "Erro ao adicionar o produto, Status: " + response.status
      );
    }
  } catch (e) {
    throw e;
  }
}
export async function putProdutoApi(produto: ICreateProduto, id: string) {
  try {
    let base = await baseUrl();
    base += "/" + id;
    const body = JSON.stringify(produto);
    const response = await fetch(base, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(
        "Erro ao atualizar o produto, Status: " + response.status
      );
    }
  } catch (e) {
    throw e;
  }
}
export async function deleteProdutoApi(id: string) {
  try {
    let base = await baseUrl();
    base += "/" + id;
    const response = await fetch(base, { method: "DELETE" });
    if (!response.ok) {
      alert(response.status);
      throw new Error("Erro ao deletar o produto, Status: " + response.status);
    }
  } catch (e) {
    throw e;
  }
}

export async function getListaProdutosPertoDeVencer(): Promise<IReadProduto[]> {
  try {
    const base = await baseUrl();
    const body = await JSON.stringify({});
    const response = await fetch(base + "/validade", {
      body: body,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("erro status: " + response.status);
    }
    const produtoSemDataFormatada =
      (await response.json()) as IReadProdutoApi[];
    const result = converterApiparaProduto(produtoSemDataFormatada);
    return result;
  } catch (e) {
    alert("Erro ao pegar os produtos, erro: " + e);
  }
  return [];
}

function converterApiparaProduto(
  produtosApi: IReadProdutoApi[]
): IReadProduto[] {
  const result = [] as IReadProduto[];
  produtosApi.forEach((produto) => {
    const novoProduto = {
      ...produto,
      validade: new Date(produto.validade),
    };
    result.push(novoProduto);
  });
  return result;
}
