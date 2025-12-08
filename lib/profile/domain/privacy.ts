import { PrivacySettingsData } from '../types/user.types';

export class PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  showActivity: boolean;

  constructor(data: Partial<PrivacySettingsData> = {}) {
    this.profileVisibility = data.profileVisibility ?? 'public';
    this.showEmail = data.showEmail ?? false;
    this.showPhone = data.showPhone ?? false;
    this.showLocation = data.showLocation ?? true;
    this.showActivity = data.showActivity ?? true;
  }

  static createDefault(): PrivacySettings {
    return new PrivacySettings();
  }

  setProfileVisibility(visibility: 'public' | 'friends' | 'private'): void {
    this.profileVisibility = visibility;

    // Si el perfil es privado, ocultar todo automáticamente
    if (visibility === 'private') {
      this.showEmail = false;
      this.showPhone = false;
      this.showLocation = false;
      this.showActivity = false;
    }
  }

  toggleField(field: 'showEmail' | 'showPhone' | 'showLocation' | 'showActivity'): void {
    this[field] = !this[field];
  }

  makePublic(): void {
    this.profileVisibility = 'public';
    this.showLocation = true;
    this.showActivity = true;
  }

  makePrivate(): void {
    this.setProfileVisibility('private');
  }

  toJSON(): PrivacySettingsData {
    return {
      profileVisibility: this.profileVisibility,
      showEmail: this.showEmail,
      showPhone: this.showPhone,
      showLocation: this.showLocation,
      showActivity: this.showActivity,
    };
  }
}
