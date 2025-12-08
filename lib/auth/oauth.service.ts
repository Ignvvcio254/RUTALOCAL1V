import { AuthService } from './auth.service';
import type { LoginResponse } from './types';

/**
 * Servicio para autenticación OAuth (Google, GitHub, etc.)
 */
export class OAuthService {
  private static readonly DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  /**
   * Inicia el flujo de login con Google
   */
  static async loginWithGoogle(): Promise<void> {
    console.log('🔍 OAuth Google - DEV_MODE:', this.DEV_MODE);
    console.log('🔍 NEXT_PUBLIC_DEV_MODE:', process.env.NEXT_PUBLIC_DEV_MODE);

    // En desarrollo, simular login exitoso
    if (this.DEV_MODE) {
      console.log('✅ Modo desarrollo detectado - Login automático con Google');
      // Simular un pequeño delay como si estuviera redirigiendo
      await new Promise(resolve => setTimeout(resolve, 500));

      // Usar el servicio de auth para hacer login con credenciales mock de Google
      const mockGoogleUser = {
        email: 'usuario.google@gmail.com',
        password: 'google-oauth-mock',
        remember: true
      };

      await AuthService.login(mockGoogleUser);
      return;
    }

    // Producción: Redirigir a Google OAuth
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`;

    if (!clientId) {
      throw new Error('Google Client ID no configurado. Configura NEXT_PUBLIC_GOOGLE_CLIENT_ID en .env.local');
    }

    const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    googleAuthUrl.searchParams.append('client_id', clientId);
    googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
    googleAuthUrl.searchParams.append('response_type', 'code');
    googleAuthUrl.searchParams.append('scope', 'openid email profile');
    googleAuthUrl.searchParams.append('access_type', 'offline');
    googleAuthUrl.searchParams.append('prompt', 'consent');

    window.location.href = googleAuthUrl.toString();
  }

  /**
   * Inicia el flujo de login con GitHub
   */
  static async loginWithGitHub(): Promise<void> {
    // En desarrollo, simular login exitoso
    if (this.DEV_MODE) {
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockGitHubUser = {
        email: 'usuario.github@github.com',
        password: 'github-oauth-mock',
        remember: true
      };

      await AuthService.login(mockGitHubUser);
      return;
    }

    // Producción: Redirigir a GitHub OAuth
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI || `${window.location.origin}/auth/github/callback`;

    if (!clientId) {
      throw new Error('GitHub Client ID no configurado. Configura NEXT_PUBLIC_GITHUB_CLIENT_ID en .env.local');
    }

    const githubAuthUrl = new URL('https://github.com/login/oauth/authorize');
    githubAuthUrl.searchParams.append('client_id', clientId);
    githubAuthUrl.searchParams.append('redirect_uri', redirectUri);
    githubAuthUrl.searchParams.append('scope', 'read:user user:email');

    window.location.href = githubAuthUrl.toString();
  }

  /**
   * Maneja el callback de OAuth y completa el login
   * @param provider - 'google' o 'github'
   * @param code - Código de autorización recibido
   */
  static async handleOAuthCallback(provider: 'google' | 'github', code: string): Promise<LoginResponse> {
    // En desarrollo, retornar usuario mock
    if (this.DEV_MODE) {
      const mockEmail = provider === 'google'
        ? 'usuario.google@gmail.com'
        : 'usuario.github@github.com';

      return AuthService.login({
        email: mockEmail,
        password: `${provider}-oauth-mock`,
        remember: true
      });
    }

    // Producción: Enviar código al backend para intercambio por tokens
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/auth/${provider}/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`Error en autenticación con ${provider}`);
    }

    return response.json();
  }
}
