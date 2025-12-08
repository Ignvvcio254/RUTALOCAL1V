'use client';

import { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  actions?: ReactNode;
}

export function SectionCard({
  title,
  description,
  icon,
  children,
  className = '',
  actions,
}: SectionCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg ${className}`}
    >
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {icon && (
              <div className="mt-1 text-primary">
                {icon}
              </div>
            )}
            <div>
              <h2 className="text-xl font-bold text-gray-900">{title}</h2>
              {description && (
                <p className="mt-1 text-sm text-gray-600">{description}</p>
              )}
            </div>
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
