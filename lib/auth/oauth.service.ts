import { AuthService } from './auth.service';
import type { LoginResponse } from './types';
import { supabase } from '@/lib/supabase/client';

/**
 * Servicio para autenticación OAuth (Google, GitHub, etc.) usando Supabase
 */
export class OAuthService {
  private static readonly DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

  /**
   * Inicia el flujo de login con Google usando Supabase Auth
   */
  static async loginWithGoogle(): Promise<void> {
    console.log('🚀 [OAuth] Iniciando login con Google...');
    console.log('🔍 [OAuth] DEV_MODE:', this.DEV_MODE);
    console.log('🔍 [OAuth] NEXT_PUBLIC_DEV_MODE:', process.env.NEXT_PUBLIC_DEV_MODE);
    console.log('🔍 [OAuth] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ Falta');
    console.log('🔍 [OAuth] NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ Falta');

    // En desarrollo, simular login exitoso
    if (this.DEV_MODE) {
      console.log('⚠️ [OAuth] Modo desarrollo detectado - Usando mock login');
      console.log('💡 [OAuth] Para producción, establece NEXT_PUBLIC_DEV_MODE=false');
      await new Promise(resolve => setTimeout(resolve, 500));

      const mockGoogleUser = {
        email: 'usuario.google@gmail.com',
        password: 'google-oauth-mock',
        remember: true
      };

      await AuthService.login(mockGoogleUser);
      return;
    }

    try {
      console.log('🔐 [OAuth] Iniciando flujo OAuth con Supabase...');
      console.log('🔗 [OAuth] Redirect URL:', `${window.location.origin}/auth/callback`);

      // Usar Supabase para autenticación con Google
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ [OAuth] Error al iniciar sesión con Supabase:', error);
        throw error;
      }

      console.log('✅ [OAuth] Redirección a Google iniciada correctamente');
      console.log('📍 [OAuth] URL de redirección:', data.url);

      // Supabase automáticamente redirige al usuario
    } catch (error) {
      console.error('❌ [OAuth] Error en loginWithGoogle:', error);
      throw error;
    }
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
