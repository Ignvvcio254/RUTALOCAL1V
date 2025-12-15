'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { ActivityData } from '@/lib/profile';
import { Heart, Star, Share2, MapPin, Route } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityTimelineProps {
  activities: ActivityData[];
}

const activityIcons: Record<string, any> = {
  visit: MapPin,
  favorite: Heart,
  review: Star,
  share: Share2,
  route: Route,
};

const activityColors: Record<string, string> = {
  visit: 'bg-blue-100 text-blue-600',
  favorite: 'bg-red-100 text-red-600',
  review: 'bg-yellow-100 text-yellow-600',
  share: 'bg-green-100 text-green-600',
  route: 'bg-indigo-100 text-indigo-600',
};

const activityLabels: Record<string, string> = {
  visit: 'Visitó',
  favorite: 'Añadió a favoritos',
  review: 'Reseñó',
  share: 'Compartió',
  route: 'Creó ruta',
};

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: activities.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
    overscan: 5,
  });

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MapPin className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-500 font-medium">No hay actividad reciente</p>
        <p className="text-gray-400 text-sm mt-1">
          Crea rutas, escribe reseñas o guarda favoritos
        </p>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="max-h-[600px] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const activity = activities[virtualItem.index];
          const Icon = activityIcons[activity.type] || MapPin;
          const colorClass = activityColors[activity.type] || 'bg-gray-100 text-gray-600';
          const label = activityLabels[activity.type] || activity.type;

          // Determinar el nombre a mostrar (negocio o ruta)
          const displayName = activity.type === 'route' 
            ? activity.routeName 
            : activity.businessName;

          // Información adicional para rutas
          const stopsCount = activity.metadata?.stopsCount;

          return (
            <div
              key={virtualItem.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div className="flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{label}</span>{' '}
                    <span className="font-semibold">{displayName || 'Sin nombre'}</span>
                  </p>
                  {activity.type === 'route' && stopsCount && (
                    <p className="text-xs text-indigo-600 mt-0.5">
                      {stopsCount} paradas
                    </p>
                  )}
                  {activity.type === 'review' && activity.metadata?.rating && (
                    <div className="flex items-center gap-1 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < activity.metadata!.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                      locale: es,
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
