'use client';

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useCallback } from 'react';
import { ActivityData } from '@/lib/profile';
import { Heart, Star, Share2, MapPin, Route, ChevronRight, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { RouteNavigationModal } from './route-navigation-modal';
import { TokenManager } from '@/lib/auth/token-manager';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-f3cae.up.railway.app';

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
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [routeData, setRouteData] = useState<any>(null);
  const [loadingRouteId, setLoadingRouteId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar detalles de una ruta
  const loadRouteDetails = useCallback(async (routeId: string) => {
    setLoadingRouteId(routeId);
    
    try {
      const token = TokenManager.getAccessToken();
      const response = await fetch(`${API_URL}/api/routes/${routeId}/`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar la ruta');
      }

      const data = await response.json();
      const route = data.data || data;

      // Transformar datos de paradas
      const formattedRoute = {
        id: route.id,
        name: route.name,
        description: route.description,
        total_distance: route.total_distance,
        estimated_duration: route.estimated_duration,
        stops: (route.stops || []).map((stop: any, index: number) => ({
          id: stop.id || `stop-${index}`,
          name: stop.business?.name || stop.name || `Parada ${index + 1}`,
          category: stop.business?.category?.name || stop.business?.category || '',
          latitude: stop.business?.location?.lat || stop.business?.latitude || stop.latitude || 0,
          longitude: stop.business?.location?.lng || stop.business?.longitude || stop.longitude || 0,
          duration: stop.duration || 30,
          order: stop.order || index + 1,
          cover_image: stop.business?.cover_image
        }))
      };

      setRouteData(formattedRoute);
      setSelectedRouteId(routeId);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading route details:', error);
    } finally {
      setLoadingRouteId(null);
    }
  }, []);

  const handleActivityClick = (activity: ActivityData) => {
    if (activity.type === 'route' && activity.routeId) {
      loadRouteDetails(activity.routeId);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRouteId(null);
    setRouteData(null);
  };

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
              <div 
                className={`flex items-start gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors ${
                  activity.type === 'route' ? 'cursor-pointer hover:bg-indigo-50' : ''
                }`}
                onClick={() => handleActivityClick(activity)}
              >
                <div className={`p-2 rounded-lg ${colorClass} flex-shrink-0`}>
                  {loadingRouteId === activity.routeId ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{label}</span>{' '}
                    <span className="font-semibold">{displayName || 'Sin nombre'}</span>
                  </p>
                  {activity.type === 'route' && stopsCount && (
                    <p className="text-xs text-indigo-600 mt-0.5 flex items-center gap-1">
                      {stopsCount} paradas
                      <ChevronRight className="w-3 h-3" />
                      <span className="text-gray-400">Click para ver ruta</span>
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

      {/* Modal de navegación de ruta */}
      <RouteNavigationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        route={routeData}
      />
    </div>
  );
}
