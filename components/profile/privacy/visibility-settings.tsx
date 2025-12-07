'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Globe, Users, Lock } from 'lucide-react';
import { PrivacySettingsData } from '@/lib/profile';

interface VisibilitySettingsProps {
  settings: PrivacySettingsData;
  onChange: (settings: Partial<PrivacySettingsData>) => void;
}

const visibilityOptions = [
  {
    value: 'public' as const,
    label: 'Público',
    description: 'Visible para todos los usuarios',
    icon: Globe,
  },
  {
    value: 'friends' as const,
    label: 'Amigos',
    description: 'Solo visible para tus amigos',
    icon: Users,
  },
  {
    value: 'private' as const,
    label: 'Privado',
    description: 'Solo visible para ti',
    icon: Lock,
  },
];

const fieldToggles = [
  {
    key: 'showEmail' as const,
    label: 'Mostrar email',
    description: 'Permite que otros usuarios vean tu correo electrónico',
  },
  {
    key: 'showPhone' as const,
    label: 'Mostrar teléfono',
    description: 'Permite que otros usuarios vean tu número de teléfono',
  },
  {
    key: 'showLocation' as const,
    label: 'Mostrar ubicación',
    description: 'Muestra tu ciudad y país en tu perfil',
  },
  {
    key: 'showActivity' as const,
    label: 'Mostrar actividad',
    description: 'Permite que otros vean tu historial de actividad',
  },
];

export function VisibilitySettings({ settings, onChange }: VisibilitySettingsProps) {
  const handleVisibilityChange = (value: 'public' | 'friends' | 'private') => {
    onChange({ profileVisibility: value });
  };

  const handleFieldToggle = (key: keyof PrivacySettingsData, value: boolean) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {/* Visibilidad del perfil */}
      <div className="space-y-4">
        <Label>Visibilidad del perfil</Label>
        <RadioGroup value={settings.profileVisibility} onValueChange={handleVisibilityChange}>
          <div className="space-y-3">
            {visibilityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = settings.profileVisibility === option.value;

              return (
                <label
                  key={option.value}
                  className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex items-start gap-3 flex-1">
                    <div
                      className={`p-2 rounded-lg ${
                        isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{option.description}</div>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </RadioGroup>
      </div>

      {/* Campos específicos */}
      <div className="border-t pt-6 space-y-4">
        <Label>¿Qué información quieres compartir?</Label>
        {fieldToggles.map((field) => (
          <div
            key={field.key}
            className="flex items-center justify-between p-4 rounded-lg border border-gray-200"
          >
            <div className="flex-1">
              <Label htmlFor={field.key} className="cursor-pointer font-medium">
                {field.label}
              </Label>
              <p className="text-sm text-gray-500 mt-0.5">{field.description}</p>
            </div>
            <Switch
              id={field.key}
              checked={settings[field.key]}
              onCheckedChange={(checked) => handleFieldToggle(field.key, checked)}
              disabled={settings.profileVisibility === 'private'}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
