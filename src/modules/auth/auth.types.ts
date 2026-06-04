export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message?: string;
  accessToken?: string;
  token?: string;
}

export interface UserTokenData {
  name: string;
  userId: string;
}
