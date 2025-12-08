'use client';

import { useState } from 'react';
import { User as UserIcon, Camera } from 'lucide-react';
import { SectionCard } from '../shared';
import { AvatarUpload } from './avatar-upload';
import { AvatarEditor } from './avatar-editor';
import { PersonalInfoForm } from './personal-info-form';
import { User, ProfileData } from '@/lib/profile';
import { imageProcessingService } from '@/lib/profile';

interface PersonalInfoSectionProps {
  user: User;
  onUpdateProfile: (data: ProfileData) => Promise<void>;
  onUpdateAvatar: (file: File) => Promise<void>;
  onRemoveAvatar: () => Promise<void>;
}

export function PersonalInfoSection({
  user,
  onUpdateProfile,
  onUpdateAvatar,
  onRemoveAvatar,
}: PersonalInfoSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setShowEditor(true);
  };

  const handleCropComplete = async (croppedArea: any) => {
    if (!selectedFile || !previewUrl) return;

    try {
      setIsSubmitting(true);

      // Procesar la imagen con crop
      const processed = await imageProcessingService.processForUpload(selectedFile, croppedArea);

      // Subir avatar
      await onUpdateAvatar(processed.file);

      // Limpiar estado
      setShowEditor(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error('Error al procesar imagen:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmitProfile = async (data: ProfileData) => {
    try {
      setIsSubmitting(true);
      await onUpdateProfile(data);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Avatar Section */}
        <SectionCard
          title="Foto de perfil"
          description="Actualiza tu imagen de perfil"
          icon={<Camera className="w-5 h-5" />}
        >
          <AvatarUpload
            currentAvatar={user.avatar.getDisplayUrl('lg')}
            onFileSelect={handleFileSelect}
            onRemove={onRemoveAvatar}
          />
        </SectionCard>

        {/* Personal Info Section */}
        <SectionCard
          title="Información personal"
          description="Actualiza tus datos personales"
          icon={<UserIcon className="w-5 h-5" />}
        >
          <PersonalInfoForm
            defaultValues={user.profile.toJSON()}
            onSubmit={handleSubmitProfile}
            isSubmitting={isSubmitting}
          />
        </SectionCard>
      </div>

      {/* Avatar Editor Modal */}
      {showEditor && previewUrl && (
        <AvatarEditor
          image={previewUrl}
          onCropComplete={handleCropComplete}
          onCancel={handleCancelEdit}
        />
      )}
    </>
  );
}
