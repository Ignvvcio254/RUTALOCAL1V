import { User } from '../domain/user';
import { UserData } from '../types/user.types';
import { ProfileData } from '../types/profile.types';
import { globalCache } from '../utils/cache.manager';
import { mockUser } from '../mock/mock-data';

const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export class UserProfileService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

    // Fetch desde API
    const response = await fetch(`${this.baseUrl}/users/${userId}`);

    if (!response.ok) {
      throw new Error('Error al obtener el perfil');
    }

    const data: UserData = await response.json();
    const user = User.create(data);

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

    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil');
    }

    const data: UserData = await response.json();
    const user = User.create(data);

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
    formData.append('avatar', file);

    const response = await fetch(`${this.baseUrl}/users/${userId}/avatar`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir el avatar');
    }

    const data = await response.json();

    // Invalidar cache
    globalCache.invalidate(`user:${userId}`);

    return data.url;
  }

  async deleteAvatar(userId: string): Promise<void> {
    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.invalidate(`user:${userId}`);
      return;
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/avatar`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Error al eliminar el avatar');
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

    const response = await fetch(`${this.baseUrl}/users/${userId}/preferences`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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

    const response = await fetch(`${this.baseUrl}/users/${userId}/privacy`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
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
