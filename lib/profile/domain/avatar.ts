import { AvatarData, AvatarSize } from '../types/profile.types';
import { ColorGenerator } from '../utils/color.generator';

export class Avatar {
  hasCustom: boolean;
  url?: string;
  thumbnail?: string;
  fallbackInitials: string;
  fallbackColor: string;

  constructor(data: Partial<AvatarData>) {
    this.hasCustom = data.hasCustom ?? false;
    this.url = data.url;
    this.thumbnail = data.thumbnail;
    this.fallbackInitials = data.fallbackInitials ?? '??';
    this.fallbackColor =
      data.fallbackColor ?? ColorGenerator.generateFromInitials(this.fallbackInitials);
  }

  static fromUser(userData: { name: string; avatar?: string }): Avatar {
    const initials = Avatar.generateInitials(userData.name);
    const color = ColorGenerator.generateFromInitials(initials);

    return new Avatar({
      hasCustom: !!userData.avatar,
      url: userData.avatar,
      thumbnail: userData.avatar,
      fallbackInitials: initials,
      fallbackColor: color,
    });
  }

  static generateInitials(name: string): string {
    if (!name || name.trim().length === 0) return '??';

    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  getDisplayUrl(size: AvatarSize = 'md'): string {
    if (this.hasCustom && this.url) {
      return size === 'sm' && this.thumbnail ? this.thumbnail : this.url;
    }

    return '';
  }

  setCustomAvatar(url: string, thumbnail?: string): void {
    this.hasCustom = true;
    this.url = url;
    this.thumbnail = thumbnail;
  }

  removeCustomAvatar(): void {
    this.hasCustom = false;
    this.url = undefined;
    this.thumbnail = undefined;
  }

  toJSON(): AvatarData {
    return {
      hasCustom: this.hasCustom,
      url: this.url,
      thumbnail: this.thumbnail,
      fallbackInitials: this.fallbackInitials,
      fallbackColor: this.fallbackColor,
    };
  }
}
