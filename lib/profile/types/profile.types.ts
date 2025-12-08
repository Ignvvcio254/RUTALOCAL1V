export interface ProfileData {
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export interface AvatarData {
  hasCustom: boolean;
  url?: string;
  thumbnail?: string;
  fallbackInitials: string;
  fallbackColor: string;
}

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ProcessedImage {
  file: File;
  url: string;
  thumbnail?: Blob;
}
