'use client';

import { useState } from 'react';
import { Settings } from 'lucide-react';
import { SectionCard } from '../shared';
import { ThemeSelector } from './theme-selector';
import { CategorySelector } from './category-selector';
import { NotificationPanel } from './notification-panel';
import { LanguageSelector } from './language-selector';
import { Button } from '@/components/ui/button';
import { User, UserPreferencesData } from '@/lib/profile';

interface PreferencesSectionProps {
  user: User;
  onUpdatePreferences: (data: Partial<UserPreferencesData>) => Promise<void>;
}

export function PreferencesSection({ user, onUpdatePreferences }: PreferencesSectionProps) {
  const [preferences, setPreferences] = useState(user.preferences.toJSON());
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setPreferences((prev) => ({ ...prev, theme }));
    setHasChanges(true);
  };

  const handleLanguageChange = (language: string) => {
    setPreferences((prev) => ({ ...prev, language }));
    setHasChanges(true);
  };

  const handleCategoriesChange = (categories: string[]) => {
    setPreferences((prev) => ({ ...prev, categories }));
    setHasChanges(true);
  };

  const handleNotificationChange = (key: keyof UserPreferencesData['notifications'], value: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdatePreferences(preferences);
      setHasChanges(false);
    } catch (error) {
      console.error('Error al guardar preferencias:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences(user.preferences.toJSON());
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Preferencias"
        description="Personaliza tu experiencia en la plataforma"
        icon={<Settings className="w-5 h-5" />}
      >
        <div className="space-y-8">
          {/* Tema */}
          <ThemeSelector value={preferences.theme} onChange={handleThemeChange} />

          {/* Idioma */}
          <div className="border-t pt-6">
            <LanguageSelector value={preferences.language} onChange={handleLanguageChange} />
          </div>

          {/* Categorías */}
          <div className="border-t pt-6">
            <CategorySelector
              selectedCategories={preferences.categories}
              onChange={handleCategoriesChange}
            />
          </div>

          {/* Notificaciones */}
          <div className="border-t pt-6">
            <NotificationPanel
              notifications={preferences.notifications}
              onChange={handleNotificationChange}
            />
          </div>

          {/* Botones de acción */}
          {hasChanges && (
            <div className="border-t pt-6 flex gap-3 justify-end">
              <Button onClick={handleReset} variant="outline" disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar preferencias'}
              </Button>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
