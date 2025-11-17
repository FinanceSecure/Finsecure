import { api } from "./authService";

export const DespesaService = {
  async listarDespesas() {
    const { data } = await api.get("/despesa/verificar");
    return data;
  },

  async criarDespesa(body: { valor: number; categoria: string; descricao: string }) {
    const { data } = await api.post("/despesa/adicionar", body);
    return data;
  },

  async atualizarDespesa(id: string, body: { valor: number; categoria: string; descricao: string }) {
    const { data } = await api.put(`/despesa/alterar/${id}`, body);
    return data;
  },

  async removerDespesa(id: string) {
    const { data } = await api.delete(`/despesa/remover/${id}`);
    return data;
  }
};
