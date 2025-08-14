import axios from "axios";

const api = axios.create({
  baseURL: "http://10.0.2.2:3000/api"
});

export const AuthService = {
  login: async (email: string, senha: string) => {
    try {
      const response = await api.post("/usuarios/login", { email, senha });
      return response.data;
    }
    catch (error: any) {
      console.error("Erro na chamada de login", error);
      const msg =
        error.response?.data?.messagem ||
        error.message?.data?.message ||
        "Erro ao realizar login";
      throw new Error(msg)
    }
  }
};
