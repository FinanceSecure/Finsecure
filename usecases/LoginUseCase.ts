import { AuthService } from "@/services/authService";
import { AuthResponse } from "../types/AuthTypes";

export class LoginUseCase {
  async execute(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    const response = await AuthService.login(email, password);
    return response;
  }
}
