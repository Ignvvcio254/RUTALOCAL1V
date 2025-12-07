export interface AuthTokens {
  accessToken: string;      // Expira en 15 min
  refreshToken: string;     // Expira en 7 días
  tokenType: 'Bearer';
  expiresIn: number;        // Segundos hasta expiración
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  emailVerified: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface LoginResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RegisterResponse {
  user: AuthUser;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
  expiresIn: number;
}
