'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { ImageUtils } from '@/lib/profile';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface AvatarUploadProps {
  currentAvatar?: string;
  onFileSelect: (file: File) => void;
  onRemove?: () => void;
}

export function AvatarUpload({ currentAvatar, onFileSelect, onRemove }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentAvatar || null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      const validation = ImageUtils.validateImageFile(file);

      if (!validation.valid) {
        setError(validation.error || 'Archivo inválido');
        return;
      }

      setError(null);
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? 'border-primary bg-primary/5 scale-105'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />

        {preview ? (
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-primary/20">
              <Image
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una imagen o haz clic'}
              </p>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG, GIF o WebP (máx. 5MB)</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview && (
        <div className="flex gap-2">
          <Button onClick={() => document.querySelector('input[type="file"]')?.click()} variant="outline" className="flex-1">
            Cambiar imagen
          </Button>
          {onRemove && (
            <Button onClick={handleRemove} variant="outline" className="flex-1">
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
