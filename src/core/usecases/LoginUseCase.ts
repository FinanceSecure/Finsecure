import { AuthService } from "@/data/services/authService";
import { AuthResponse } from "@/types/AuthTypes";
import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;

export class LoginUseCase {
  async execute(credentials: LoginCredentials): Promise<AuthResponse> {
    const validatedData = LoginSchema.parse(credentials);
    const response = await AuthService.login(
      validatedData.email,
      validatedData.password
    );

    if (!response || !response.token)
      throw new Error(
        "Falha na autenticação: Credenciais inválidas ou token ausente."
      );

    return response;
  }
}
