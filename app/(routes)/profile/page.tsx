'use client';

import { useProfile } from '@/hooks/profile/use-profile';
import { ProfileShell } from '@/components/profile';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';
import { BottomNav } from '@/components/bottom-nav';

export default function ProfilePage() {
  const { user: authUser } = useAuth();

  const {
    user,
    isLoading,
    error,
    updateProfile,
    updateAvatar,
    removeAvatar,
    updatePreferences,
    updatePrivacy,
  } = useProfile(authUser?.id || '');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-0">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-0">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Error al cargar el perfil</h2>
            <p className="text-gray-600 mt-2">{error}</p>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pb-20 lg:pb-0">
        <div className="text-center space-y-4">
          <p className="text-gray-600">No se encontró el usuario</p>
        </div>
        <BottomNav />
      </div>
    );
  }

  // Wrappers para hacer coincidir los tipos esperados por ProfileShell
  const handleUpdateProfile = async (data: any) => {
    await updateProfile(data);
  };

  const handleUpdateAvatar = async (file: File) => {
    await updateAvatar(file);
  };

  const handleUpdatePreferences = async (data: any) => {
    await updatePreferences(data);
  };

  const handleUpdatePrivacy = async (data: any) => {
    await updatePrivacy(data);
  };

  return (
    <div className="pb-20 lg:pb-0">
      <ProfileShell
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onUpdateAvatar={handleUpdateAvatar}
        onRemoveAvatar={removeAvatar}
        onUpdatePreferences={handleUpdatePreferences}
        onUpdatePrivacy={handleUpdatePrivacy}
      />

      {/* Bottom Navigation (solo mobile) */}
      <BottomNav />
    </div>
  );
}
