export interface UserData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  avatarThumbnail?: string;
  location?: LocationData;
  createdAt?: string;
  preferences?: UserPreferencesData;
  privacy?: PrivacySettingsData;
}

export interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface UserPreferencesData {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  categories: string[];
  notifications: NotificationPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  marketing: boolean;
  updates: boolean;
  recommendations: boolean;
}

export interface PrivacySettingsData {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showActivity: boolean;
}
