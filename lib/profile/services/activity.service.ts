import { ActivityData, StatsData, BadgeData } from '../types/api.types';
import { globalCache } from '../utils/cache.manager';
import { mockActivities, mockStats, mockBadges } from '../mock/mock-data';

const USE_MOCK_DATA = process.env.NODE_ENV === 'development';

export class ActivityService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getActivities(userId: string, limit: number = 50): Promise<ActivityData[]> {
    const cacheKey = `activities:${userId}:${limit}`;
    const cached = globalCache.get<ActivityData[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      const sorted = mockActivities.slice(0, limit).sort((a, b) => b.timestamp - a.timestamp);
      globalCache.set(cacheKey, sorted, 120000);
      return sorted;
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/activities?limit=${limit}`);

    if (!response.ok) {
      throw new Error('Error al obtener actividades');
    }

    const data: ActivityData[] = await response.json();

    // Ordenar por timestamp descendente
    const sorted = data.sort((a, b) => b.timestamp - a.timestamp);

    // Cachear por 2 minutos
    globalCache.set(cacheKey, sorted, 120000);

    return sorted;
  }

  async getStats(userId: string): Promise<StatsData> {
    const cacheKey = `stats:${userId}`;
    const cached = globalCache.get<StatsData>(cacheKey);

    if (cached) {
      return cached;
    }

    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.set(cacheKey, mockStats, 300000);
      return mockStats;
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/stats`);

    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }

    const data: StatsData = await response.json();

    // Cachear por 5 minutos
    globalCache.set(cacheKey, data, 300000);

    return data;
  }

  async getBadges(userId: string): Promise<BadgeData[]> {
    const cacheKey = `badges:${userId}`;
    const cached = globalCache.get<BadgeData[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Usar datos mock en desarrollo
    if (USE_MOCK_DATA) {
      await this.delay();
      globalCache.set(cacheKey, mockBadges, 600000);
      return mockBadges;
    }

    const response = await fetch(`${this.baseUrl}/users/${userId}/badges`);

    if (!response.ok) {
      throw new Error('Error al obtener insignias');
    }

    const data: BadgeData[] = await response.json();

    // Cachear por 10 minutos
    globalCache.set(cacheKey, data, 600000);

    return data;
  }

  async getFavorites(userId: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/users/${userId}/favorites`);

    if (!response.ok) {
      throw new Error('Error al obtener favoritos');
    }

    return await response.json();
  }

  filterActivitiesByType(activities: ActivityData[], type: ActivityData['type']): ActivityData[] {
    return activities.filter(activity => activity.type === type);
  }

  groupActivitiesByDate(activities: ActivityData[]): Record<string, ActivityData[]> {
    const grouped: Record<string, ActivityData[]> = {};

    activities.forEach(activity => {
      const date = new Date(activity.timestamp).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      if (!grouped[date]) {
        grouped[date] = [];
      }

      grouped[date].push(activity);
    });

    return grouped;
  }

  getRecentActivities(activities: ActivityData[], days: number = 7): ActivityData[] {
    const now = Date.now();
    const cutoff = now - days * 24 * 60 * 60 * 1000;

    return activities.filter(activity => activity.timestamp >= cutoff);
  }

  invalidateCache(userId: string): void {
    globalCache.invalidatePattern(`activities:${userId}`);
    globalCache.invalidate(`stats:${userId}`);
    globalCache.invalidate(`badges:${userId}`);
  }
}

export const activityService = new ActivityService();
