import { ActivityData, StatsData, BadgeData } from '../types/api.types';
import { globalCache } from '../utils/cache.manager';
import { mockActivities, mockStats, mockBadges } from '../mock/mock-data';
import { TokenManager } from '@/lib/auth/token-manager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-f3cae.up.railway.app';

export class ActivityService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number = 500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAuthHeaders() {
    const token = TokenManager.getAccessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Obtener actividades del usuario desde el backend
   * Combina rutas creadas, reviews, favoritos y visitas
   */
  async getActivities(userId: string, limit: number = 50): Promise<ActivityData[]> {
    const cacheKey = `activities:${userId}:${limit}`;
    const cached = globalCache.get<ActivityData[]>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const activities: ActivityData[] = [];

      // 1. Obtener rutas del usuario
      try {
        const routesResponse = await fetch(`${API_URL}/api/routes/`, {
          headers: this.getAuthHeaders()
        });
        
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          const routes = routesData.data?.results || routesData.data || [];
          
          routes.forEach((route: any) => {
            activities.push({
              id: `route-${route.id}`,
              type: 'route',
              routeId: route.id,
              routeName: route.name,
              timestamp: new Date(route.created_at).getTime(),
              metadata: {
                stopsCount: route.stops_count || route.stops?.length || 0,
                isPublic: route.is_public
              }
            });
          });
        }
      } catch (err) {
        console.warn('Could not fetch routes for activity:', err);
      }

      // 2. Obtener reviews del usuario
      try {
        const reviewsResponse = await fetch(`${API_URL}/api/reviews/my-reviews/`, {
          headers: this.getAuthHeaders()
        });
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const reviews = reviewsData.data?.results || reviewsData.data || reviewsData || [];
          
          if (Array.isArray(reviews)) {
            reviews.forEach((review: any) => {
              activities.push({
                id: `review-${review.id}`,
                type: 'review',
                businessId: review.business?.id || review.business_id,
                businessName: review.business?.name || review.business_name || 'Negocio',
                timestamp: new Date(review.created_at).getTime(),
                metadata: {
                  rating: review.rating,
                  comment: review.comment
                }
              });
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch reviews for activity:', err);
      }

      // Ordenar por timestamp descendente
      const sorted = activities
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit);

      // Cachear por 2 minutos
      globalCache.set(cacheKey, sorted, 120000);

      return sorted;
    } catch (error) {
      console.error('Error fetching activities:', error);
      // Fallback a mock data si hay error
      await this.delay();
      return mockActivities.slice(0, limit);
    }
  }

  /**
   * Obtener estadísticas reales del usuario
   */
  async getStats(userId: string): Promise<StatsData> {
    const cacheKey = `stats:${userId}`;
    const cached = globalCache.get<StatsData>(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      let totalRoutes = 0;
      let totalReviews = 0;
      let totalFavorites = 0;
      let totalVisits = 0;
      let memberSince = new Date().toISOString();

      // 1. Contar rutas
      try {
        const routesResponse = await fetch(`${API_URL}/api/routes/`, {
          headers: this.getAuthHeaders()
        });
        
        if (routesResponse.ok) {
          const routesData = await routesResponse.json();
          const routes = routesData.data?.results || routesData.data || [];
          totalRoutes = routes.length;
        }
      } catch (err) {
        console.warn('Could not fetch routes count:', err);
      }

      // 2. Contar reviews
      try {
        const reviewsResponse = await fetch(`${API_URL}/api/reviews/my-reviews/`, {
          headers: this.getAuthHeaders()
        });
        
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          const reviews = reviewsData.data?.results || reviewsData.data || reviewsData || [];
          totalReviews = Array.isArray(reviews) ? reviews.length : 0;
        }
      } catch (err) {
        console.warn('Could not fetch reviews count:', err);
      }

      // 3. Obtener info del usuario (memberSince)
      try {
        const userResponse = await fetch(`${API_URL}/api/auth/user/`, {
          headers: this.getAuthHeaders()
        });
        
        if (userResponse.ok) {
          const userData = await userResponse.json();
          memberSince = userData.date_joined || userData.created_at || memberSince;
        }
      } catch (err) {
        console.warn('Could not fetch user info:', err);
      }

      const stats: StatsData = {
        totalVisits,
        totalFavorites,
        totalReviews,
        totalRoutes,
        memberSince
      };

      // Cachear por 5 minutos
      globalCache.set(cacheKey, stats, 300000);

      return stats;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return mockStats;
    }
  }

  async getBadges(userId: string): Promise<BadgeData[]> {
    const cacheKey = `badges:${userId}`;
    const cached = globalCache.get<BadgeData[]>(cacheKey);

    if (cached) {
      return cached;
    }

    // Por ahora usar mock badges - se puede implementar backend después
    await this.delay();
    globalCache.set(cacheKey, mockBadges, 600000);
    return mockBadges;
  }

  async getFavorites(userId: string): Promise<any[]> {
    try {
      const response = await fetch(`${API_URL}/api/users/me/favorites/`, {
        headers: this.getAuthHeaders()
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return data.data || data || [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
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
