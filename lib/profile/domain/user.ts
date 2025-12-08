import { UserData } from '../types/user.types';
import { UserProfile } from './profile';
import { UserPreferences } from './preferences';
import { PrivacySettings } from './privacy';
import { Avatar } from './avatar';

export class User {
  readonly id: string;
  private _profile: UserProfile;
  private _preferences: UserPreferences;
  private _privacy: PrivacySettings;
  readonly createdAt: string;

  constructor(data: UserData) {
    this.id = data.id;
    this.createdAt = data.createdAt ?? new Date().toISOString();

    const avatar = Avatar.fromUser({
      name: data.name,
      avatar: data.avatar,
    });

    this._profile = new UserProfile({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      location: data.location,
      avatar,
    });

    this._preferences = new UserPreferences(data.preferences);
    this._privacy = new PrivacySettings(data.privacy);
  }

  get profile(): UserProfile {
    return this._profile;
  }

  get preferences(): UserPreferences {
    return this._preferences;
  }

  get privacy(): PrivacySettings {
    return this._privacy;
  }

  get fullName(): string {
    return this._profile.name;
  }

  get initials(): string {
    return this._profile.avatar.fallbackInitials;
  }

  get email(): string {
    return this._profile.email;
  }

  get avatar(): Avatar {
    return this._profile.avatar;
  }

  updateProfile(data: Partial<UserData>): void {
    this._profile.update({
      name: data.name,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      location: data.location,
    });
  }

  updatePreferences(data: Partial<UserData['preferences']>): void {
    if (data?.theme) this._preferences.updateTheme(data.theme);
    if (data?.language) this._preferences.updateLanguage(data.language);
    if (data?.categories) this._preferences.categories = data.categories;
    if (data?.notifications) {
      Object.entries(data.notifications).forEach(([key, value]) => {
        this._preferences.updateNotification(
          key as keyof UserData['preferences']['notifications'],
          value
        );
      });
    }
  }

  updatePrivacy(data: Partial<UserData['privacy']>): void {
    if (data?.profileVisibility) {
      this._privacy.setProfileVisibility(data.profileVisibility);
    }
    if (data?.showEmail !== undefined) this._privacy.showEmail = data.showEmail;
    if (data?.showPhone !== undefined) this._privacy.showPhone = data.showPhone;
    if (data?.showLocation !== undefined) this._privacy.showLocation = data.showLocation;
    if (data?.showActivity !== undefined) this._privacy.showActivity = data.showActivity;
  }

  setAvatar(url: string, thumbnail?: string): void {
    this._profile.avatar.setCustomAvatar(url, thumbnail);
  }

  removeAvatar(): void {
    this._profile.avatar.removeCustomAvatar();
  }

  toJSON(): UserData {
    return {
      id: this.id,
      name: this._profile.name,
      email: this._profile.email,
      phone: this._profile.phone,
      bio: this._profile.bio,
      avatar: this._profile.avatar.url,
      avatarThumbnail: this._profile.avatar.thumbnail,
      location: this._profile.location,
      createdAt: this.createdAt,
      preferences: this._preferences.toJSON(),
      privacy: this._privacy.toJSON(),
    };
  }

  static create(data: UserData): User {
    return new User(data);
  }
}
