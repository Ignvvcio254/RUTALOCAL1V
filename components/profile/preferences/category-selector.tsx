'use client';

import { X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

interface CategorySelectorProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

const availableCategories = [
  'Restaurantes',
  'Cafeterías',
  'Bares',
  'Tiendas',
  'Servicios',
  'Entretenimiento',
  'Salud y bienestar',
  'Educación',
  'Tecnología',
  'Arte y cultura',
  'Deportes',
  'Mascotas',
];

export function CategorySelector({ selectedCategories, onChange }: CategorySelectorProps) {
  const handleToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onChange(selectedCategories.filter((c) => c !== category));
    } else {
      onChange([...selectedCategories, category]);
    }
  };

  const handleRemove = (category: string) => {
    onChange(selectedCategories.filter((c) => c !== category));
  };

  return (
    <div className="space-y-3">
      <Label>Categorías de interés</Label>
      <p className="text-sm text-gray-500">
        Selecciona las categorías que te interesan para recibir recomendaciones personalizadas
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
        {availableCategories.map((category) => {
          const isSelected = selectedCategories.includes(category);

          return (
            <label
              key={category}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => handleToggle(category)}
              />
              <span className="text-sm">{category}</span>
            </label>
          );
        })}
      </div>

      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
          {selectedCategories.map((category) => (
            <Badge
              key={category}
              variant="secondary"
              className="px-3 py-1.5 text-sm"
            >
              {category}
              <button
                onClick={() => handleRemove(category)}
                className="ml-2 hover:bg-gray-300 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
