import { AuthUser } from '@/lib/auth/types';
import { UserData } from '../types/user.types';

/**
 * Adaptador que transforma datos del backend de autenticación
 * al formato esperado por el sistema de perfiles
 */
export function authUserToProfileUser(authUser: AuthUser): UserData {
  return {
    id: authUser.id,
    name: authUser.name || authUser.username || authUser.email.split('@')[0],
    email: authUser.email,
    phone: undefined,
    bio: undefined,
    avatar: authUser.avatar,
    avatarThumbnail: undefined,
    location: undefined,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'auto' as const,
      language: 'es',
      categories: [],
      notifications: {
        email: true,
        push: true,
        sms: false,
        marketing: false,
        updates: true,
        recommendations: true,
      }
    },
    privacy: {
      profileVisibility: 'public' as const,
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showActivity: true,
    }
  };
}

/**
 * Transforma datos extendidos del backend al formato UserData
 */
export function backendUserToProfileUser(backendUser: any): UserData {
  return {
    id: backendUser.id,
    name: backendUser.name || `${backendUser.first_name || ''} ${backendUser.last_name || ''}`.trim() || backendUser.username,
    email: backendUser.email,
    phone: backendUser.phone || undefined,
    bio: backendUser.bio || undefined,
    avatar: backendUser.avatar || undefined,
    avatarThumbnail: backendUser.avatar_thumbnail || undefined,
    location: backendUser.location ? {
      city: backendUser.location.city,
      state: backendUser.location.state,
      country: backendUser.location.country,
      coordinates: backendUser.location.coordinates,
    } : undefined,
    createdAt: backendUser.created_at || backendUser.createdAt,
    preferences: {
      theme: backendUser.preferences?.theme || 'auto',
      language: backendUser.preferred_language || backendUser.preferences?.language || 'es',
      categories: backendUser.preferences?.categories || [],
      notifications: backendUser.preferences?.notifications || {
        email: backendUser.notifications_enabled !== false,
        push: backendUser.notifications_enabled !== false,
        sms: false,
        marketing: false,
        updates: true,
        recommendations: true,
      }
    },
    privacy: backendUser.privacy || {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
      showLocation: false,
      showActivity: true,
    }
  };
}
