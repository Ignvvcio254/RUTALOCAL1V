'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProfileData } from '@/lib/profile';

const profileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  bio: z.string().max(500, 'La biografía no puede exceder 500 caracteres').optional(),
  location: z.object({
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface PersonalInfoFormProps {
  defaultValues: ProfileData;
  onSubmit: (data: ProfileData) => void;
  isSubmitting?: boolean;
}

export function PersonalInfoForm({ defaultValues, onSubmit, isSubmitting = false }: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Nombre */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nombre completo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Tu nombre completo"
          className={errors.name ? 'border-red-500' : ''}
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>
        </Label>
        <Input
          id="email"
          type="email"
          {...register('email')}
          placeholder="tu@email.com"
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Teléfono */}
      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          {...register('phone')}
          placeholder="+34 600 000 000"
          className={errors.phone ? 'border-red-500' : ''}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
      </div>

      {/* Biografía */}
      <div className="space-y-2">
        <Label htmlFor="bio">Biografía</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Cuéntanos algo sobre ti..."
          rows={4}
          className={errors.bio ? 'border-red-500' : ''}
        />
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      {/* Ubicación */}
      <div className="space-y-4">
        <Label>Ubicación</Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Input
              {...register('location.city')}
              placeholder="Ciudad"
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('location.state')}
              placeholder="Provincia/Estado"
            />
          </div>
          <div className="space-y-2">
            <Input
              {...register('location.country')}
              placeholder="País"
            />
          </div>
        </div>
      </div>

      {/* Botón de enviar */}
      {isDirty && (
        <div className="pt-4 border-t">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      )}
    </form>
  );
}
