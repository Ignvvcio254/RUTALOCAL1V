'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw } from 'lucide-react';

interface AvatarEditorProps {
  image: string;
  onCropComplete: (croppedArea: any) => void;
  onCancel: () => void;
}

export function AvatarEditor({ image, onCropComplete, onCancel }: AvatarEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((newCrop: any) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback(
    (_: any, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm p-4 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h2 className="text-white text-lg font-semibold">Editar Avatar</h2>
          <div className="flex gap-2">
            <Button onClick={onCancel} variant="ghost" className="text-white hover:bg-white/10">
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-primary hover:bg-primary/90">
              Guardar
            </Button>
          </div>
        </div>
      </div>

      {/* Cropper */}
      <div className="flex-1 relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={handleCropComplete}
          onZoomChange={onZoomChange}
        />
      </div>

      {/* Controls */}
      <div className="bg-black/50 backdrop-blur-sm p-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Zoom */}
          <div className="flex items-center gap-4">
            <ZoomOut className="w-5 h-5 text-white" />
            <Slider
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
              min={1}
              max={3}
              step={0.1}
              className="flex-1"
            />
            <ZoomIn className="w-5 h-5 text-white" />
          </div>

          {/* Rotation */}
          <div className="flex items-center gap-4">
            <RotateCw className="w-5 h-5 text-white" />
            <Slider
              value={[rotation]}
              onValueChange={([value]) => setRotation(value)}
              min={0}
              max={360}
              step={1}
              className="flex-1"
            />
            <span className="text-white text-sm w-12">{rotation}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
