import { User } from '../domain/user';
import { UserData } from '../types/user.types';
import { ProfileData } from '../types/profile.types';
import { globalCache } from '../utils/cache.manager';
import { mockUser } from '../mock/mock-data';
import { backendUserToProfileUser } from '../adapters/auth-to-profile.adapter';
import { TokenManager } from '@/lib/auth/token-manager';
import { env } from '@/lib/env';

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export class UserProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = env.apiUrl) {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthHeaders(): HeadersInit {
    const token = TokenManager.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    };
  }

  async getProfile(userId: string): Promise<User> {
    // Verificar cache primero
    const cached = globalCache.get<User>(`user:${userId}`);
    if (cached) {
      return cached;
    }

    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      const user = User.create({ ...mockUser, id: userId });
      globalCache.set(`user:${userId}`, user);
      return user;
    }

    // Fetch desde API backend real - usar endpoint /api/auth/me/
    const response = await fetch(`${this.baseUrl}/api/auth/me/`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }

    const backendData = await response.json();

    // Transformar datos del backend al formato UserData
    const userData = backendUserToProfileUser(backendData);
    const user = User.create(userData);

    // Cachear resultado
    globalCache.set(`user:${userId}`, user);

    return user;
  }

  async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<User> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      const updatedData = { ...mockUser, ...profileData, id: userId };
      const user = User.create(updatedData);
      globalCache.invalidate(`user:${userId}`);
      globalCache.set(`user:${userId}`, user);
      return user;
    }

    // Transformar datos del perfil al formato del backend
    const backendData: any = {};
    if (profileData.name) {
      const nameParts = profileData.name.split(' ');
      backendData.first_name = nameParts[0] || '';
      backendData.last_name = nameParts.slice(1).join(' ') || '';
    }
    if (profileData.phone) backendData.phone = profileData.phone;
    if (profileData.bio) backendData.bio = profileData.bio;
    if (profileData.location) backendData.location = profileData.location;

    const response = await fetch(`${this.baseUrl}/api/users/profile/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(backendData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    const responseData = await response.json();
    const userData = backendUserToProfileUser(responseData);
    const user = User.create(userData);

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);

    // Cachear nuevo resultado
    globalCache.set(`user:${userId}`, user);

    return user;
  }

  async uploadAvatar(userId: string, file: File): Promise<string> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.invalidate(`user:${userId}`);
      return URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append('image', file); // Cloudinary espera 'image', no 'avatar'

    const token = TokenManager.getAccessToken();
    const response = await fetch(`${this.baseUrl}/api/media/profile/upload/`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        // NO incluir Content-Type con FormData, el browser lo setea automáticamente
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al subir el avatar');
    }

    const data = await response.json();

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);

    // El endpoint de Cloudinary retorna: { success: true, data: { avatar, avatar_thumbnail } }
    return data.data?.avatar || data.avatar || data.url;
  }

  async deleteAvatar(userId: string): Promise<void> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.invalidate(`user:${userId}`);
      return;
    }

    const response = await fetch(`${this.baseUrl}/api/media/profile/delete/`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al eliminar el avatar');
    }

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);
  }

  async updatePreferences(userId: string, preferences: Partial<UserData['preferences']>): Promise<void> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.invalidate(`user:${userId}`);
      return;
    }

    const response = await fetch(`${this.baseUrl}/api/users/preferences/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar las preferencias');
    }

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);
  }

  async updatePrivacy(userId: string, privacy: Partial<UserData['privacy']>): Promise<void> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.invalidate(`user:${userId}`);
      return;
    }

    const response = await fetch(`${this.baseUrl}/api/users/privacy/`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(privacy),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar la privacidad');
    }

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);
  }
}

export const userProfileService = new UserProfileService();
