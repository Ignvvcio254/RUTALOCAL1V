import { UserData, ActivityData, StatsData, BadgeData } from '../types/api.types';

export const mockUser: UserData = {
  id: 'user-123',
  name: 'María González',
  email: 'maria.gonzalez@example.com',
  phone: '+34 600 123 456',
  bio: 'Amante de la comida local y exploradora de nuevos lugares. Siempre en busca de la mejor experiencia gastronómica.',
  avatar: undefined,
  location: {
    city: 'Madrid',
    state: 'Madrid',
    country: 'España',
  },
  createdAt: '2024-03-15T10:00:00Z',
  preferences: {
    theme: 'auto',
    language: 'es',
    categories: ['Restaurantes', 'Cafeterías', 'Arte y cultura'],
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      updates: true,
      recommendations: true,
    },
  },
  privacy: {
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showLocation: true,
    showActivity: true,
  },
};

export const mockActivities: ActivityData[] = [
  {
    id: '1',
    type: 'visit',
    businessId: 'biz-1',
    businessName: 'Café Central',
    timestamp: Date.now() - 1000 * 60 * 30, // 30 minutos atrás
  },
  {
    id: '2',
    type: 'favorite',
    businessId: 'biz-2',
    businessName: 'Restaurante La Bodega',
    timestamp: Date.now() - 1000 * 60 * 60 * 2, // 2 horas atrás
  },
  {
    id: '3',
    type: 'review',
    businessId: 'biz-3',
    businessName: 'Librería Moderna',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 horas atrás
  },
  {
    id: '4',
    type: 'share',
    businessId: 'biz-4',
    businessName: 'Panadería Artesanal',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 día atrás
  },
  {
    id: '5',
    type: 'visit',
    businessId: 'biz-5',
    businessName: 'Museo de Arte Contemporáneo',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 días atrás
  },
  {
    id: '6',
    type: 'favorite',
    businessId: 'biz-6',
    businessName: 'Bar El Rincón',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 días atrás
  },
  {
    id: '7',
    type: 'review',
    businessId: 'biz-7',
    businessName: 'Tienda de Decoración',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4, // 4 días atrás
  },
  {
    id: '8',
    type: 'visit',
    businessId: 'biz-8',
    businessName: 'Gimnasio FitLife',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 días atrás
  },
];

export const mockStats: StatsData = {
  totalVisits: 142,
  totalFavorites: 38,
  totalReviews: 24,
  memberSince: '2024-03-15T10:00:00Z',
};

export const mockBadges: BadgeData[] = [
  {
    id: 'badge-1',
    name: 'Explorador',
    description: 'Visitó 100 negocios diferentes',
    icon: '🗺️',
    earnedAt: '2024-09-01T10:00:00Z',
  },
  {
    id: 'badge-2',
    name: 'Crítico',
    description: 'Escribió 20 reseñas',
    icon: '✍️',
    earnedAt: '2024-10-15T10:00:00Z',
  },
  {
    id: 'badge-3',
    name: 'Influencer',
    description: 'Compartió 50 negocios',
    icon: '📢',
    earnedAt: '2024-11-01T10:00:00Z',
  },
];

// Mock service wrapper para simular API calls
export class MockProfileService {
  private delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

  async getUser(userId: string): Promise<UserData> {
    await this.delay();
    return { ...mockUser, id: userId };
  }

  async updateUser(userId: string, data: Partial<UserData>): Promise<UserData> {
    await this.delay();
    return { ...mockUser, ...data, id: userId };
  }

  async getActivities(userId: string): Promise<ActivityData[]> {
    await this.delay();
    return mockActivities;
  }

  async getStats(userId: string): Promise<StatsData> {
    await this.delay();
    return mockStats;
  }

  async getBadges(userId: string): Promise<BadgeData[]> {
    await this.delay();
    return mockBadges;
  }
}

export const mockProfileService = new MockProfileService();
