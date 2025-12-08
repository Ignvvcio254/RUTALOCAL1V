'use client';

import { useState } from 'react';
import { Shield } from 'lucide-react';
import { SectionCard } from '../shared';
import { VisibilitySettings } from './visibility-settings';
import { Button } from '@/components/ui/button';
import { User, PrivacySettingsData } from '@/lib/profile';

interface PrivacySectionProps {
  user: User;
  onUpdatePrivacy: (data: Partial<PrivacySettingsData>) => Promise<void>;
}

export function PrivacySection({ user, onUpdatePrivacy }: PrivacySectionProps) {
  const [settings, setSettings] = useState(user.privacy.toJSON());
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingsChange = (newSettings: Partial<PrivacySettingsData>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onUpdatePrivacy(settings);
      setHasChanges(false);
    } catch (error) {
      console.error('Error al guardar configuración de privacidad:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(user.privacy.toJSON());
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Privacidad y Seguridad"
        description="Controla quién puede ver tu información"
        icon={<Shield className="w-5 h-5" />}
      >
        <div className="space-y-6">
          <VisibilitySettings settings={settings} onChange={handleSettingsChange} />

          {hasChanges && (
            <div className="border-t pt-6 flex gap-3 justify-end">
              <Button onClick={handleReset} variant="outline" disabled={isSaving}>
                Cancelar
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}
