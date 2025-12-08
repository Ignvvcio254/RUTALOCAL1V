'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ThemeSelectorProps {
  value: 'light' | 'dark' | 'auto';
  onChange: (value: 'light' | 'dark' | 'auto') => void;
}

const themes = [
  {
    value: 'light' as const,
    label: 'Claro',
    icon: Sun,
    description: 'Tema claro todo el tiempo',
  },
  {
    value: 'dark' as const,
    label: 'Oscuro',
    icon: Moon,
    description: 'Tema oscuro todo el tiempo',
  },
  {
    value: 'auto' as const,
    label: 'Auto',
    icon: Monitor,
    description: 'Se adapta al sistema',
  },
];

export function ThemeSelector({ value, onChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <Label>Tema de la aplicación</Label>
      <RadioGroup value={value} onValueChange={onChange}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = value === theme.value;

            return (
              <label
                key={theme.value}
                className={`relative flex flex-col items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <RadioGroupItem
                  value={theme.value}
                  id={theme.value}
                  className="sr-only"
                />
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                    isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-medium text-gray-900">{theme.label}</span>
                <span className="text-xs text-gray-500 mt-1 text-center">
                  {theme.description}
                </span>
              </label>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}
