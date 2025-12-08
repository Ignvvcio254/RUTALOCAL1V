'use client';

import { User, Settings, Lock, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    id: 'personal',
    label: 'Información Personal',
    icon: User,
    description: 'Datos básicos y avatar',
  },
  {
    id: 'preferences',
    label: 'Preferencias',
    icon: Settings,
    description: 'Tema y notificaciones',
  },
  {
    id: 'privacy',
    label: 'Privacidad',
    icon: Lock,
    description: 'Seguridad y visibilidad',
  },
  {
    id: 'activity',
    label: 'Actividad',
    icon: Activity,
    description: 'Historial e insignias',
  },
];

export function ProfileSidebar({ activeSection, onSectionChange }: ProfileSidebarProps) {
  return (
    <nav className="space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;

        return (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id)}
            className={cn(
              'w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              isActive
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'text-gray-700 hover:bg-gray-100'
            )}
          >
            <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <div className="font-medium">{section.label}</div>
              <div
                className={cn(
                  'text-xs mt-0.5',
                  isActive ? 'text-white/80' : 'text-gray-500'
                )}
              >
                {section.description}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}
