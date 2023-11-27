import { Component } from "solid-js";
import ProdutoForm from "../components/ProdutoForm";
import Header from "../components/Header";

const AdicionarProduto: Component = () => {
  const produto = {
    nome: "",
    lote: "",
    id: -1,
    validade: new Date(),
  };
  return (
    <>
      <Header nome="Adicionar"></Header>
      <div class="flex flex-col items-center justify-center gap-4">
        <ProdutoForm produtoApi={produto} editar={false} />
      </div>
    </>
  );
};

export default AdicionarProduto;
