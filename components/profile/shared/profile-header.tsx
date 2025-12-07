'use client';

import { User } from '@/lib/profile';
import { AvatarFallback } from './avatar-fallback';
import { Calendar } from 'lucide-react';
import Image from 'next/image';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const avatar = user.avatar;
  const memberSince = new Date(user.createdAt).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative group">
          {avatar.hasCustom && avatar.url ? (
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-lg">
              <Image
                src={avatar.getDisplayUrl('lg')}
                alt={user.fullName}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="ring-4 ring-white shadow-lg rounded-full">
              <AvatarFallback
                initials={user.initials}
                color={avatar.fallbackColor}
                size="xl"
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900">{user.fullName}</h1>
          <p className="text-gray-600 mt-1">{user.email}</p>

          <div className="flex items-center justify-center md:justify-start gap-2 mt-3 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Miembro desde {memberSince}</span>
          </div>

          {user.profile.bio && (
            <p className="mt-4 text-gray-700 max-w-2xl">{user.profile.bio}</p>
          )}

          {user.profile.location && (
            <div className="mt-3 text-sm text-gray-600">
              {[
                user.profile.location.city,
                user.profile.location.state,
                user.profile.location.country,
              ]
                .filter(Boolean)
                .join(', ')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
