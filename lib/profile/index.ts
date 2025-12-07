// Domain exports
export { User } from './domain/user';
export { UserProfile } from './domain/profile';
export { Avatar } from './domain/avatar';
export { UserPreferences } from './domain/preferences';
export { PrivacySettings } from './domain/privacy';

// Services exports
export { userProfileService, UserProfileService } from './services/user-profile.service';
export { imageProcessingService, ImageProcessingService } from './services/image-processing.service';
export { preferencesService, PreferencesService } from './services/preferences.service';
export { activityService, ActivityService } from './services/activity.service';

// Repository exports
export { ApiUserRepository, type IUserRepository } from './repositories/user.repository';
export { CachedUserRepository } from './repositories/cached-user.repository';

// Utils exports
export { ValidationEngine } from './utils/validation.engine';
export { CacheManager, globalCache } from './utils/cache.manager';
export { ColorGenerator } from './utils/color.generator';
export { ImageUtils } from './utils/image.utils';

// Types exports
export type {
  UserData,
  LocationData,
  UserPreferencesData,
  NotificationPreferences,
  PrivacySettingsData,
} from './types/user.types';

export type {
  ProfileData,
  ValidationResult,
  AvatarData,
  AvatarSize,
  CropArea,
  ProcessedImage,
} from './types/profile.types';

export type {
  ApiResponse,
  CacheEntry,
  ValidationRule,
  ActivityData,
  StatsData,
  BadgeData,
} from './types/api.types';
