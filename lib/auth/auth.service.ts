import { TokenManager } from './token-manager';
import type {
  LoginCredentials,
  RegisterCredentials,
  LoginResponse,
  RegisterResponse,
  AuthUser,
  AuthTokens,
  RefreshTokenResponse,
} from './types';

// Usar NEXT_PUBLIC_DEV_MODE para modo desarrollo (funciona en cliente y servidor)
const USE_MOCK_DATA =
  process.env.NEXT_PUBLIC_DEV_MODE === 'true' ||
  process.env.NODE_ENV === 'development';

// Mock data para desarrollo
const mockUser: AuthUser = {
  id: 'user-123',
  email: 'demo@rutalocal.cl',
  name: 'Usuario Demo',
  role: 'user',
  emailVerified: true,
};

const mockTokens: AuthTokens = {
  accessToken: 'mock_access_token_' + Date.now(),
  refreshToken: 'mock_refresh_token_' + Date.now(),
  tokenType: 'Bearer',
  expiresIn: 900, // 15 minutos
};

export class AuthService {
  private static readonly API_URL =
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  private static refreshPromise: Promise<AuthTokens> | null = null;

  private static async delay(ms: number = 500) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Login con email y contraseña
   */
  static async login(credentials: LoginCredentials): Promise<LoginResponse> {
    // Modo mock para desarrollo
    if (USE_MOCK_DATA) {
      console.log('🔧 [AuthService] Modo desarrollo - Login mock');
      console.log('📧 Email:', credentials.email);
      await this.delay();

      // Validación simple para mock - acepta CUALQUIER credencial
      if (credentials.email && credentials.password) {
        console.log('✅ [AuthService] Credenciales aceptadas - Generando mock user');
        const response: LoginResponse = {
          user: mockUser,
          tokens: mockTokens,
        };

        await TokenManager.saveTokens(response.tokens, credentials.remember || false);
        console.log('✅ [AuthService] Tokens guardados');
        return response;
      }

      console.error('❌ [AuthService] Credenciales vacías');
      throw new Error('Credenciales inválidas');
    }

    // Modo producción
    const response = await fetch(`${this.API_URL}/api/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al iniciar sesión');
    }

    const data: LoginResponse = await response.json();

    // Guardar tokens
    await TokenManager.saveTokens(data.tokens, credentials.remember || false);

    return data;
  }

  /**
   * Registro de nuevo usuario
   */
  static async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    // Modo mock para desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();

      const response: RegisterResponse = {
        user: {
          ...mockUser,
          email: credentials.email,
          name: credentials.name,
        },
        tokens: mockTokens,
      };

      await TokenManager.saveTokens(response.tokens, true);
      return response;
    }

    // Modo producción
    const response = await fetch(`${this.API_URL}/api/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al registrarse');
    }

    const data: RegisterResponse = await response.json();
    await TokenManager.saveTokens(data.tokens, true);

    return data;
  }

  /**
   * Refresh token (renovar access token)
   */
  static async refreshAccessToken(): Promise<AuthTokens> {
    // Evitar múltiples llamadas simultáneas
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      const refreshToken = TokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Modo mock para desarrollo
      if (USE_MOCK_DATA) {
        await this.delay(200);
        const newTokens: AuthTokens = {
          ...mockTokens,
          accessToken: 'mock_access_token_refreshed_' + Date.now(),
        };
        TokenManager.saveTokens(newTokens, true);
        return newTokens;
      }

      // Modo producción
      const response = await fetch(`${this.API_URL}/api/auth/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (!response.ok) {
        TokenManager.clearTokens();
        throw new Error('Failed to refresh token');
      }

      const data: RefreshTokenResponse = await response.json();

      const tokens: AuthTokens = {
        accessToken: data.access,
        refreshToken: data.refresh || refreshToken,
        tokenType: 'Bearer',
        expiresIn: data.expiresIn || 900,
      };

      TokenManager.saveTokens(tokens, true);

      return tokens;
    })();

    try {
      const tokens = await this.refreshPromise;
      return tokens;
    } finally {
      this.refreshPromise = null;
    }
  }

  /**
   * Obtiene el usuario actual
   */
  static async getCurrentUser(): Promise<AuthUser> {
    const token = TokenManager.getAccessToken();

    if (!token) {
      throw new Error('No access token');
    }

    // Si el token está expirado, renovar
    if (TokenManager.isTokenExpired()) {
      await this.refreshAccessToken();
    }

    // Modo mock para desarrollo
    if (USE_MOCK_DATA) {
      await this.delay(200);
      return mockUser;
    }

    // Modo producción
    const response = await fetch(`${this.API_URL}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${TokenManager.getAccessToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  }

  /**
   * Logout
   */
  static async logout(): Promise<void> {
    const refreshToken = TokenManager.getRefreshToken();

    // Modo mock para desarrollo
    if (USE_MOCK_DATA) {
      await this.delay(200);
      TokenManager.clearTokens();
      return;
    }

    // Modo producción
    if (refreshToken) {
      try {
        await fetch(`${this.API_URL}/api/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${TokenManager.getAccessToken()}`,
          },
          body: JSON.stringify({ refresh: refreshToken }),
        });
      } catch {
        // Ignorar errores de logout
      }
    }

    TokenManager.clearTokens();
  }

  /**
   * Verifica si hay sesión activa
   */
  static hasActiveSession(): boolean {
    const token = TokenManager.getAccessToken();
    return !!token && !TokenManager.isTokenExpired();
  }

  /**
   * Verifica si el usuario está autenticado (incluso si el token expiró)
   */
  static isAuthenticated(): boolean {
    return !!TokenManager.getAccessToken();
  }
}
