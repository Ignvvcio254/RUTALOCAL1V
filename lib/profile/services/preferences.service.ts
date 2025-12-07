import { UserPreferences } from '../domain/preferences';
import { UserPreferencesData } from '../types/user.types';

export class PreferencesService {
  private storageKey: string = 'ruta_local_preferences';

  async getPreferences(userId: string): Promise<UserPreferences> {
    // Primero intentar obtener de localStorage (cache local)
    const localPrefs = this.getLocalPreferences(userId);

    if (localPrefs) {
      return localPrefs;
    }

    // Si no hay en local, crear preferencias por defecto
    const defaultPrefs = UserPreferences.createDefault();

    // Guardar en localStorage
    this.saveLocalPreferences(userId, defaultPrefs);

    return defaultPrefs;
  }

  async updatePreferences(userId: string, data: Partial<UserPreferencesData>): Promise<void> {
    const current = await this.getPreferences(userId);

    if (data.theme) current.updateTheme(data.theme);
    if (data.language) current.updateLanguage(data.language);
    if (data.categories) current.categories = data.categories;
    if (data.notifications) {
      Object.entries(data.notifications).forEach(([key, value]) => {
        current.updateNotification(key as keyof UserPreferencesData['notifications'], value);
      });
    }

    // Guardar en localStorage
    this.saveLocalPreferences(userId, current);
  }

  async resetToDefaults(userId: string): Promise<void> {
    const prefs = UserPreferences.createDefault();
    this.saveLocalPreferences(userId, prefs);
  }

  private getLocalPreferences(userId: string): UserPreferences | null {
    try {
      const key = `${this.storageKey}_${userId}`;
      const stored = localStorage.getItem(key);

      if (!stored) return null;

      const data = JSON.parse(stored) as UserPreferencesData;
      return new UserPreferences(data);
    } catch (error) {
      console.error('Error al leer preferencias locales:', error);
      return null;
    }
  }

  private saveLocalPreferences(userId: string, preferences: UserPreferences): void {
    try {
      const key = `${this.storageKey}_${userId}`;
      localStorage.setItem(key, JSON.stringify(preferences.toJSON()));
    } catch (error) {
      console.error('Error al guardar preferencias locales:', error);
    }
  }

  // Sync con el servidor (opcional)
  async syncWithServer(userId: string): Promise<void> {
    const localPrefs = this.getLocalPreferences(userId);

    if (!localPrefs) return;

    try {
      await fetch(`/api/users/${userId}/preferences`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(localPrefs.toJSON()),
      });
    } catch (error) {
      console.error('Error al sincronizar preferencias:', error);
    }
  }
}

export const preferencesService = new PreferencesService();
