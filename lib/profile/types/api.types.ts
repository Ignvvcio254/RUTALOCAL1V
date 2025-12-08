export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface CacheEntry<T = any> {
  value: T;
  timestamp: number;
  ttl: number;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'phone' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
  validator?: (value: any) => boolean;
}

export interface ActivityData {
  id: string;
  type: 'visit' | 'favorite' | 'review' | 'share';
  businessId: string;
  businessName: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface StatsData {
  totalVisits: number;
  totalFavorites: number;
  totalReviews: number;
  memberSince: string;
}

export interface BadgeData {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}
