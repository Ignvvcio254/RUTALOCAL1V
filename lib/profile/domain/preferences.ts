import { UserPreferencesData, NotificationPreferences } from '../types/user.types';

export class UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  categories: string[];
  notifications: NotificationPreferences;

  constructor(data: Partial<UserPreferencesData> = {}) {
    this.theme = data.theme ?? 'auto';
    this.language = data.language ?? 'es';
    this.categories = data.categories ?? [];
    this.notifications = data.notifications ?? {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      updates: true,
      recommendations: true,
    };
  }

  static createDefault(): UserPreferences {
    return new UserPreferences();
  }

  updateTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.theme = theme;
  }

  updateLanguage(language: string): void {
    this.language = language;
  }

  addCategory(category: string): void {
    if (!this.categories.includes(category)) {
      this.categories.push(category);
    }
  }

  removeCategory(category: string): void {
    this.categories = this.categories.filter(c => c !== category);
  }

  toggleCategory(category: string): void {
    if (this.categories.includes(category)) {
      this.removeCategory(category);
    } else {
      this.addCategory(category);
    }
  }

  updateNotification(
    key: keyof NotificationPreferences,
    value: boolean
  ): void {
    this.notifications[key] = value;
  }

  toggleNotification(key: keyof NotificationPreferences): void {
    this.notifications[key] = !this.notifications[key];
  }

  resetToDefaults(): void {
    this.theme = 'auto';
    this.language = 'es';
    this.categories = [];
    this.notifications = {
      email: true,
      push: true,
      sms: false,
      marketing: false,
      updates: true,
      recommendations: true,
    };
  }

  toJSON(): UserPreferencesData {
    return {
      theme: this.theme,
      language: this.language,
      categories: [...this.categories],
      notifications: { ...this.notifications },
    };
  }
}
