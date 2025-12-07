import { ProcessedImage, CropArea } from '../types/profile.types';
import { ImageUtils } from '../utils/image.utils';

export class ImageProcessingService {
  private maxWidth: number = 800;
  private maxHeight: number = 800;
  private thumbnailSize: number = 150;
  private quality: number = 0.85;

  async compressImage(file: File, maxSize?: number): Promise<File> {
    const validation = ImageUtils.validateImageFile(file);

    if (!validation.valid) {
      throw new Error(validation.error || 'Archivo inválido');
    }

    const targetSize = maxSize ?? this.maxWidth;
    return await ImageUtils.compressImage(file, targetSize, targetSize, this.quality);
  }

  async generateThumbnail(file: File, size?: number): Promise<Blob> {
    const validation = ImageUtils.validateImageFile(file);

    if (!validation.valid) {
      throw new Error(validation.error || 'Archivo inválido');
    }

    return await ImageUtils.generateThumbnail(file, size ?? this.thumbnailSize);
  }

  async cropImage(file: File, crop: CropArea): Promise<File> {
    const validation = ImageUtils.validateImageFile(file);

    if (!validation.valid) {
      throw new Error(validation.error || 'Archivo inválido');
    }

    return await ImageUtils.cropImage(file, crop);
  }

  async processForUpload(file: File, crop?: CropArea): Promise<ProcessedImage> {
    const validation = this.validateImageFile(file);

    if (!validation.valid) {
      throw new Error(validation.error || 'Archivo inválido');
    }

    let processedFile = file;

    // Si hay crop, aplicarlo primero
    if (crop) {
      processedFile = await this.cropImage(file, crop);
    }

    // Comprimir
    const optimizedFile = await this.optimizeForWeb(processedFile);

    // Generar thumbnail
    const thumbnail = await this.generateThumbnail(optimizedFile);

    // Crear URL temporal
    const url = URL.createObjectURL(optimizedFile);

    return {
      file: optimizedFile,
      url,
      thumbnail,
    };
  }

  private validateImageFile(file: File): { valid: boolean; error?: string } {
    return ImageUtils.validateImageFile(file);
  }

  private async optimizeForWeb(file: File): Promise<File> {
    const dimensions = await ImageUtils.getImageDimensions(file);

    // Si la imagen es más grande que el máximo, comprimirla
    if (dimensions.width > this.maxWidth || dimensions.height > this.maxHeight) {
      return await this.compressImage(file);
    }

    // Si la imagen es pequeña pero el archivo es grande, comprimir de todos modos
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > 1) {
      return await this.compressImage(file);
    }

    return file;
  }

  async getDimensions(file: File): Promise<{ width: number; height: number }> {
    return await ImageUtils.getImageDimensions(file);
  }

  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}

export const imageProcessingService = new ImageProcessingService();
