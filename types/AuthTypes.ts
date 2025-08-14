export interface AuthResponse {
  mensagem: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
