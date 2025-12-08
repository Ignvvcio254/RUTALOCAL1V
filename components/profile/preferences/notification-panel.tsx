'use client';

import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { NotificationPreferences } from '@/lib/profile';
import { Mail, Bell, MessageSquare, ShoppingBag, Megaphone, Sparkles } from 'lucide-react';

interface NotificationPanelProps {
  notifications: NotificationPreferences;
  onChange: (key: keyof NotificationPreferences, value: boolean) => void;
}

const notificationOptions = [
  {
    key: 'email' as const,
    label: 'Notificaciones por email',
    description: 'Recibe actualizaciones en tu correo electrónico',
    icon: Mail,
  },
  {
    key: 'push' as const,
    label: 'Notificaciones push',
    description: 'Recibe alertas en tu navegador',
    icon: Bell,
  },
  {
    key: 'sms' as const,
    label: 'Notificaciones por SMS',
    description: 'Recibe mensajes de texto para eventos importantes',
    icon: MessageSquare,
  },
  {
    key: 'marketing' as const,
    label: 'Ofertas y promociones',
    description: 'Entérate de descuentos y ofertas especiales',
    icon: ShoppingBag,
  },
  {
    key: 'updates' as const,
    label: 'Actualizaciones de la plataforma',
    description: 'Novedades y mejoras del servicio',
    icon: Megaphone,
  },
  {
    key: 'recommendations' as const,
    label: 'Recomendaciones personalizadas',
    description: 'Sugerencias basadas en tus intereses',
    icon: Sparkles,
  },
];

export function NotificationPanel({ notifications, onChange }: NotificationPanelProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base">Preferencias de notificaciones</Label>
        <p className="text-sm text-gray-500 mt-1">
          Elige cómo y cuándo quieres recibir notificaciones
        </p>
      </div>

      <div className="space-y-4">
        {notificationOptions.map((option) => {
          const Icon = option.icon;
          const isEnabled = notifications[option.key];

          return (
            <div
              key={option.key}
              className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <div className={`p-2 rounded-lg ${isEnabled ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-500'}`}>
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <Label
                  htmlFor={option.key}
                  className="text-sm font-medium cursor-pointer"
                >
                  {option.label}
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  {option.description}
                </p>
              </div>

              <Switch
                id={option.key}
                checked={isEnabled}
                onCheckedChange={(checked) => onChange(option.key, checked)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
