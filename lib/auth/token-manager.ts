import { AuthTokens } from './types';

export class TokenManager {
  private static readonly ACCESS_TOKEN_KEY = 'ruta_local_access_token';
  private static readonly REFRESH_TOKEN_KEY = 'ruta_local_refresh_token';
  private static readonly TOKEN_EXPIRY_KEY = 'ruta_local_token_expiry';

  /**
   * Guarda tokens en localStorage/sessionStorage
   */
  static saveTokens(tokens: AuthTokens, remember: boolean = false): void {
    const storage = remember ? localStorage : sessionStorage;

    storage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    storage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);

    const expiryTime = Date.now() + tokens.expiresIn * 1000;
    storage.setItem(this.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }

  /**
   * Obtiene el access token
   */
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      localStorage.getItem(this.ACCESS_TOKEN_KEY) ||
      sessionStorage.getItem(this.ACCESS_TOKEN_KEY)
    );
  }

  /**
   * Obtiene el refresh token
   */
  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    return (
      localStorage.getItem(this.REFRESH_TOKEN_KEY) ||
      sessionStorage.getItem(this.REFRESH_TOKEN_KEY)
    );
  }

  /**
   * Verifica si el token está expirado
   */
  static isTokenExpired(): boolean {
    if (typeof window === 'undefined') return true;

    const expiry =
      localStorage.getItem(this.TOKEN_EXPIRY_KEY) ||
      sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!expiry) return true;

    return Date.now() > parseInt(expiry, 10);
  }

  /**
   * Limpia todos los tokens
   */
  static clearTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);

    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  /**
   * Decodifica el JWT (sin verificar firma)
   */
  static decodeToken(token: string): Record<string, unknown> | null {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  }

  /**
   * Obtiene el tiempo restante hasta la expiración (en segundos)
   */
  static getTimeUntilExpiry(): number {
    if (typeof window === 'undefined') return 0;

    const expiry =
      localStorage.getItem(this.TOKEN_EXPIRY_KEY) ||
      sessionStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!expiry) return 0;

    const remainingTime = parseInt(expiry, 10) - Date.now();
    return Math.max(0, Math.floor(remainingTime / 1000));
  }
}
