'use client';

import { useState, useEffect } from 'react';
import { User, userProfileService, ProfileData } from '@/lib/profile';

export function useProfile(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const userData = await userProfileService.getProfile(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      loadProfile();
    }
  }, [userId]);

  const updateProfile = async (data: Partial<ProfileData>) => {
    if (!user) throw new Error('No user loaded');

    try {
      const updatedUser = await userProfileService.updateProfile(user.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      throw err;
    }
  };

  const updateAvatar = async (file: File) => {
    if (!user) throw new Error('No user loaded');

    try {
      const avatarUrl = await userProfileService.uploadAvatar(user.id, file);
      // Recargar el perfil para obtener los datos actualizados
      const updatedUser = await userProfileService.getProfile(user.id);
      setUser(updatedUser);
      return avatarUrl;
    } catch (err) {
      throw err;
    }
  };

  const removeAvatar = async () => {
    if (!user) throw new Error('No user loaded');

    try {
      await userProfileService.deleteAvatar(user.id);
      // Recargar el perfil
      const updatedUser = await userProfileService.getProfile(user.id);
      setUser(updatedUser);
    } catch (err) {
      throw err;
    }
  };

  const updatePreferences = async (data: any) => {
    if (!user) throw new Error('No user loaded');

    try {
      await userProfileService.updatePreferences(user.id, data);
      // Recargar el perfil
      const updatedUser = await userProfileService.getProfile(user.id);
      setUser(updatedUser);
    } catch (err) {
      throw err;
    }
  };

  const updatePrivacy = async (data: any) => {
    if (!user) throw new Error('No user loaded');

    try {
      await userProfileService.updatePrivacy(user.id, data);
      // Recargar el perfil
      const updatedUser = await userProfileService.getProfile(user.id);
      setUser(updatedUser);
    } catch (err) {
      throw err;
    }
  };

  return {
    user,
    isLoading,
    error,
    updateProfile,
    updateAvatar,
    removeAvatar,
    updatePreferences,
    updatePrivacy,
    refetch: () => userProfileService.getProfile(userId).then(setUser),
  };
}
