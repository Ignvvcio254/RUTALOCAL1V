'use client';

import { useState } from 'react';
import { imageProcessingService, CropArea } from '@/lib/profile';

export function useAvatarUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectFile = (file: File) => {
    setError(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const processAndUpload = async (
    cropArea: CropArea,
    onUpload: (file: File) => Promise<void>
  ) => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    try {
      setIsProcessing(true);
      setError(null);

      const processed = await imageProcessingService.processForUpload(selectedFile, cropArea);
      await onUpload(processed.file);

      // Cleanup
      clear();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al procesar la imagen';
      setError(message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const clear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setError(null);
  };

  return {
    selectedFile,
    previewUrl,
    isProcessing,
    error,
    selectFile,
    processAndUpload,
    clear,
  };
}
