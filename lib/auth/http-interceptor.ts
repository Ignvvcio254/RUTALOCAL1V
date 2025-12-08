import { TokenManager } from './token-manager';
import { AuthService } from './auth.service';

export class HttpInterceptor {
  /**
   * Fetch wrapper con auto-refresh de tokens
   */
  static async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const token = TokenManager.getAccessToken();

    // Agregar token si existe
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    let response = await fetch(url, options);

    // Si es 401, intentar renovar token
    if (response.status === 401) {
      try {
        await AuthService.refreshAccessToken();

        // Reintentar con nuevo token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${TokenManager.getAccessToken()}`,
        };

        response = await fetch(url, options);
      } catch {
        // Token refresh falló, limpiar y redirigir
        TokenManager.clearTokens();

        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }

        throw new Error('Session expired');
      }
    }

    return response;
  }

  /**
   * GET request con autenticación
   */
  static async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * POST request con autenticación
   */
  static async post<T>(
    url: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * PATCH request con autenticación
   */
  static async patch<T>(
    url: string,
    data?: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * DELETE request con autenticación
   */
  static async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(url, {
      ...options,
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}
