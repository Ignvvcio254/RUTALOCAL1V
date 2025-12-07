'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { ActivityData } from '@/lib/profile';
import { Heart, Star, Share2, MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface ActivityTimelineProps {
  activities: ActivityData[];
}

const activityIcons = {
  visit: MapPin,
  favorite: Heart,
  review: Star,
  share: Share2,
};

const activityColors = {
  visit: 'bg-blue-100 text-blue-600',
  favorite: 'bg-red-100 text-red-600',
  review: 'bg-yellow-100 text-yellow-600',
  share: 'bg-green-100 text-green-600',
};

const activityLabels = {
  visit: 'Visitó',
  favorite: 'Añadió a favoritos',
  review: 'Reseñó',
  share: 'Compartió',
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
        <p className="text-gray-500">No hay actividad reciente</p>
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
          const Icon = activityIcons[activity.type];
          const colorClass = activityColors[activity.type];
          const label = activityLabels[activity.type];

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
                    <span className="font-semibold">{activity.businessName}</span>
                  </p>
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
