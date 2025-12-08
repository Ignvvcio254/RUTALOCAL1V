'use client';

import { AvatarSize } from '@/lib/profile';
import { ColorGenerator } from '@/lib/profile';

interface AvatarFallbackProps {
  initials: string;
  color?: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, { container: string; text: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-12 h-12', text: 'text-sm' },
  lg: { container: 'w-20 h-20', text: 'text-2xl' },
  xl: { container: 'w-32 h-32', text: 'text-4xl' },
};

export function AvatarFallback({
  initials,
  color,
  size = 'md',
  className = '',
}: AvatarFallbackProps) {
  const bgColor = color || ColorGenerator.generateFromInitials(initials);
  const textColor = ColorGenerator.getContrastColor(bgColor);
  const { container, text } = sizeMap[size];

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center font-semibold ${text} ${className}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
      }}
    >
      {initials}
    </div>
  );
}
