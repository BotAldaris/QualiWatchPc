import { ResponseType, getClient, Body } from "@tauri-apps/api/http";
import IReadProduto from "../interfaces/Produtos/ReadProduto";
import ICreateProduto from "../interfaces/Produtos/CreateProduto";
import IReadProdutoApi from "../interfaces/Produtos/ReadProdutoApi";
import { Store } from "tauri-plugin-store-api";

const storeUrl = new Store(".settings.dat");
const storeValidade = new Store(".validade.dat");

const baseUrl = async () => {
  const base = await storeUrl.get("url");
  if (!base) {
    throw new Error("registre uma url");
  }
  const result = `${base}/Produtos`;
  return result;
};

export async function readProduto(): Promise<IReadProduto[]> {
  try {
    const client = await getClient();
    const base = await baseUrl();
    const response = await client.get<IReadProdutoApi[]>(base, {
      timeout: 180,
      responseType: ResponseType.JSON,
    });
    if (!response.ok) {
      throw new Error("erro status: " + response.status);
    }
    const produtoSemDataFormatada = response.data as IReadProdutoApi[];
    const result = converterApiparaProduto(produtoSemDataFormatada);
    return result;
  } catch (e) {
    console.log(e);
    throw new Error("Erro ao pegar os produtos, erro: " + e);
  }
}
export async function readProdutoByIdApi(id: string): Promise<IReadProduto> {
  try {
    const client = await getClient();
    const base = await baseUrl();
    let s = base + "/" + id;
    const response = await client.get<IReadProdutoApi>(s, {
      timeout: 180,
      responseType: ResponseType.JSON,
    });
    if (response.status > 300) {
      throw new Error("erro status: " + response.status);
    }
    const produto = response.data as IReadProdutoApi;
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
    const client = await getClient();
    const base = await baseUrl();
    const body = Body.json(produto);
    console.log(produto.validade.toUTCString());
    const response = await client.post(base, body);
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
    const client = await getClient();
    const base = await baseUrl();
    const body = Body.json(produto);
    const response = await client.put(`${base}/${id}`, body);
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
    const client = await getClient();
    const base = await baseUrl();
    const response = await client.delete(`${base}/${id}`);
    if (!response.ok) {
      alert(response.status);
      throw new Error("Erro ao deletar o produto, Status: " + response.status);
    }
  } catch (e) {
    throw e;
  }
}

export async function atualizarListaProdutosPertodeVencer() {
  try {
    const client = await getClient();
    const base = await baseUrl();
    const body = await criarBodyComValidade();
    const data = new Date();
    const response = await client.post<IReadProdutoApi[]>(
      base + "/validade",
      body,
      { responseType: ResponseType.JSON }
    );
    if (!response.ok) {
      throw new Error("erro status: " + response.status);
    }
    const produtoSemDataFormatada = response.data as IReadProdutoApi[];
    const produtos = await getListaProdutosPertoDeVencerApi();
    await storeValidade.set("ultimaAtulizacao", data);
    produtoSemDataFormatada.forEach((p) => produtos.push(p));
    storeValidade.set("validades", produtos);
  } catch (e) {
    alert(e);
    throw new Error("Erro ao pegar os produtos, erro: " + e);
  }
}

export async function getListaProdutosPertoDeVencerApi(): Promise<
  IReadProdutoApi[]
> {
  if (await storeValidade.has("validades")) {
    const dados = (await storeValidade.get("validades")) as IReadProdutoApi[];
    return dados;
  }
  return [] as IReadProdutoApi[];
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

export async function getListaProdutosPertoDeVencer(): Promise<IReadProduto[]> {
  const produtosSemDataFormatada = await getListaProdutosPertoDeVencerApi();
  const result = converterApiparaProduto(produtosSemDataFormatada);
  return result;
}

async function criarBodyComValidade(): Promise<Body> {
  const validade = await storeValidade.get("ultimaAtulizacao");
  if (validade) {
    return Body.json({ ultimaAtulizacao: validade });
  }
  return Body.json({});
}
