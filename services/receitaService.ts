import {
  CriarRendaVariavelDTO,
  EditarRendaVariavelDTO,
  RendaVariavelResponse
} from "@/types";
import { api } from "./authService";

export const ReceitaService = {
  async listarRendaVariavel(): Promise<RendaVariavelResponse> {
    const { data } = await api.get("/receita/verificar/rendaVariavel");
    return data;
  },

  async criarRendaVariavel(body: CriarRendaVariavelDTO) {
    const { data } = await api.post("/receita/adicionar/rendaVariavel", body);
    return data;
  },

  async atualizarRendaVariavel(body: EditarRendaVariavelDTO) {
    const { data } = await api.put("/receita/alterar/rendaVariavel", body);
    return data;
  },

  async deletarRendaVariavel(id: string) {
    const { data } = await api.delete(`/receita/remover/rendaVariavel/${id}`);
    return data;
  }
};
