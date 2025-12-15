'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Navigation, Clock, Route as RouteIcon, 
  ChevronRight, X, ExternalLink, Loader2,
  Play, Pause, SkipForward, RotateCcw
} from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiaWdudmN2Y2lvMjU0IiwiYSI6ImNtNW80Y2t1cjBrNzkybXNkZDlpamR2amsifQ.L1F2oAPdkGkIDiJFA56QNw';

interface RouteStop {
  id: string;
  name: string;
  category?: string;
  latitude: number;
  longitude: number;
  duration?: number;
  order: number;
  cover_image?: string;
}

interface RouteData {
  id: string;
  name: string;
  description?: string;
  stops: RouteStop[];
  total_distance?: number;
  estimated_duration?: number;
}

interface RouteNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  route: RouteData | null;
}

/**
 * Modal de navegación tipo Google Maps
 * Muestra la ruta con direcciones paso a paso
 */
export function RouteNavigationModal({ isOpen, onClose, route }: RouteNavigationModalProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [routeGeometry, setRouteGeometry] = useState<any>(null);
  const [loadingRoute, setLoadingRoute] = useState(false);

  // Colores para categorías
  const categoryColors: Record<string, string> = {
    "café": "#f97316",
    "cafetería": "#f97316",
    "gastronomía": "#ef4444",
    "restaurante": "#ef4444",
    "arte": "#a855f7",
    "tour": "#3b82f6",
    "turismo": "#3b82f6",
    "hostal": "#10b981",
    "hospedaje": "#10b981",
    "hotel": "#10b981",
  };

  const getColor = (category?: string) => {
    if (!category) return "#6366f1";
    return categoryColors[category.toLowerCase()] || "#6366f1";
  };

  // Obtener ruta de Mapbox Directions API
  const fetchDirections = useCallback(async (stops: RouteStop[]) => {
    if (stops.length < 2) return null;

    setLoadingRoute(true);
    
    try {
      const coordinates = stops
        .map(stop => `${stop.longitude},${stop.latitude}`)
        .join(';');

      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?` +
        `geometries=geojson&overview=full&steps=true&access_token=${MAPBOX_TOKEN}`
      );

      if (!response.ok) throw new Error('Error fetching directions');

      const data = await response.json();
      
      if (data.routes && data.routes[0]) {
        setRouteGeometry(data.routes[0].geometry);
        return data.routes[0];
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    } finally {
      setLoadingRoute(false);
    }

    return null;
  }, []);

  // Inicializar mapa
  useEffect(() => {
    if (!isOpen || !mapContainer.current || !route || route.stops.length === 0) return;

    // Limpiar mapa anterior
    if (map.current) {
      map.current.remove();
      map.current = null;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const firstStop = route.stops[0];
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [firstStop.longitude, firstStop.latitude],
      zoom: 14,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      setMapLoaded(false);
    };
  }, [isOpen, route]);

  // Dibujar ruta y marcadores cuando el mapa esté listo
  useEffect(() => {
    if (!map.current || !mapLoaded || !route || route.stops.length === 0) return;

    const drawRoute = async () => {
      // Limpiar marcadores anteriores
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Obtener ruta de direcciones
      const directions = await fetchDirections(route.stops);

      // Agregar marcadores
      route.stops.forEach((stop, index) => {
        const el = document.createElement('div');
        const isCurrentStop = index === currentStopIndex;
        
        el.innerHTML = `
          <div style="
            width: ${isCurrentStop ? '40px' : '32px'};
            height: ${isCurrentStop ? '40px' : '32px'};
            background: ${isCurrentStop ? '#4f46e5' : getColor(stop.category)};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${isCurrentStop ? '16px' : '14px'};
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            border: 3px solid ${isCurrentStop ? '#fff' : 'rgba(255,255,255,0.8)'};
            transition: all 0.3s ease;
            ${isCurrentStop ? 'animation: pulse 2s infinite;' : ''}
          ">
            ${index + 1}
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="padding: 8px; max-width: 200px;">
            <strong>${stop.name}</strong>
            ${stop.category ? `<p style="margin: 4px 0 0; font-size: 12px; color: #666;">${stop.category}</p>` : ''}
            ${stop.duration ? `<p style="margin: 4px 0 0; font-size: 11px; color: #888;">⏱️ ${stop.duration} min</p>` : ''}
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([stop.longitude, stop.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);
      });

      // Dibujar línea de ruta
      if (routeGeometry || directions?.geometry) {
        const geometry = routeGeometry || directions?.geometry;

        // Remover fuente anterior si existe
        if (map.current?.getSource('route')) {
          map.current.removeLayer('route-line');
          map.current.removeLayer('route-line-outline');
          map.current.removeSource('route');
        }

        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: geometry
          }
        });

        // Línea de contorno (más gruesa)
        map.current?.addLayer({
          id: 'route-line-outline',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#1e3a5f',
            'line-width': 8,
            'line-opacity': 0.4
          }
        });

        // Línea principal
        map.current?.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4f46e5',
            'line-width': 5
          }
        });
      }

      // Ajustar vista para mostrar toda la ruta
      if (route.stops.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        route.stops.forEach(stop => {
          bounds.extend([stop.longitude, stop.latitude]);
        });

        map.current?.fitBounds(bounds, {
          padding: { top: 60, bottom: 60, left: 60, right: 60 },
          maxZoom: 15,
          duration: 1000
        });
      }
    };

    drawRoute();
  }, [mapLoaded, route, currentStopIndex, fetchDirections, routeGeometry]);

  // Navegar a la siguiente parada
  const goToNextStop = () => {
    if (!route || currentStopIndex >= route.stops.length - 1) return;
    
    const nextIndex = currentStopIndex + 1;
    setCurrentStopIndex(nextIndex);
    
    const nextStop = route.stops[nextIndex];
    map.current?.flyTo({
      center: [nextStop.longitude, nextStop.latitude],
      zoom: 16,
      duration: 1500
    });
  };

  // Navegar a parada anterior
  const goToPrevStop = () => {
    if (currentStopIndex <= 0) return;
    
    const prevIndex = currentStopIndex - 1;
    setCurrentStopIndex(prevIndex);
    
    const prevStop = route?.stops[prevIndex];
    if (prevStop) {
      map.current?.flyTo({
        center: [prevStop.longitude, prevStop.latitude],
        zoom: 16,
        duration: 1500
      });
    }
  };

  // Abrir en Google Maps
  const openInGoogleMaps = () => {
    if (!route || route.stops.length === 0) return;

    const origin = route.stops[0];
    const destination = route.stops[route.stops.length - 1];
    const waypoints = route.stops.slice(1, -1);

    let url = `https://www.google.com/maps/dir/?api=1`;
    url += `&origin=${origin.latitude},${origin.longitude}`;
    url += `&destination=${destination.latitude},${destination.longitude}`;
    
    if (waypoints.length > 0) {
      const waypointStr = waypoints
        .map(w => `${w.latitude},${w.longitude}`)
        .join('|');
      url += `&waypoints=${encodeURIComponent(waypointStr)}`;
    }
    
    url += `&travelmode=walking`;

    window.open(url, '_blank');
  };

  // Reiniciar navegación
  const resetNavigation = () => {
    setCurrentStopIndex(0);
    setIsNavigating(false);
    
    if (route && route.stops.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      route.stops.forEach(stop => {
        bounds.extend([stop.longitude, stop.latitude]);
      });
      
      map.current?.fitBounds(bounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
        maxZoom: 15,
        duration: 1000
      });
    }
  };

  const currentStop = route?.stops[currentStopIndex];
  const nextStop = route?.stops[currentStopIndex + 1];

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-4 pb-2 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-indigo-600" />
                {route?.name || 'Mi Ruta'}
              </DialogTitle>
              {route?.description && (
                <p className="text-sm text-gray-500 mt-1">{route.description}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col md:flex-row h-full">
          {/* Mapa */}
          <div className="flex-1 relative min-h-[300px] md:min-h-0">
            <div ref={mapContainer} className="absolute inset-0" />
            
            {loadingRoute && (
              <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                  <span className="text-sm text-gray-600">Calculando ruta...</span>
                </div>
              </div>
            )}

            {/* Controles de navegación en el mapa */}
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 z-10">
              <div className="bg-white rounded-xl shadow-lg p-4">
                {currentStop && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                        Parada {currentStopIndex + 1} de {route?.stops.length}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900">{currentStop.name}</h4>
                    {currentStop.category && (
                      <p className="text-sm text-gray-500">{currentStop.category}</p>
                    )}
                  </div>
                )}

                {nextStop && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3 p-2 bg-gray-50 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-indigo-500" />
                    <span>Siguiente: <strong>{nextStop.name}</strong></span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPrevStop}
                    disabled={currentStopIndex === 0}
                    className="flex-1"
                  >
                    ← Anterior
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetNavigation}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={goToNextStop}
                    disabled={!nextStop}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                  >
                    Siguiente →
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Panel lateral con paradas */}
          <div className="w-full md:w-80 border-t md:border-t-0 md:border-l bg-gray-50 overflow-y-auto max-h-[40vh] md:max-h-none">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Paradas</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={openInGoogleMaps}
                  className="text-xs"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Google Maps
                </Button>
              </div>

              <div className="space-y-2">
                {route?.stops.map((stop, index) => (
                  <button
                    key={stop.id}
                    onClick={() => {
                      setCurrentStopIndex(index);
                      map.current?.flyTo({
                        center: [stop.longitude, stop.latitude],
                        zoom: 16,
                        duration: 1500
                      });
                    }}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${
                      index === currentStopIndex 
                        ? 'bg-indigo-100 border-2 border-indigo-500' 
                        : 'bg-white border border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        index === currentStopIndex ? 'bg-indigo-600' : 'bg-gray-400'
                      }`}
                      style={{ backgroundColor: index === currentStopIndex ? '#4f46e5' : getColor(stop.category) }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${
                        index === currentStopIndex ? 'text-indigo-900' : 'text-gray-900'
                      }`}>
                        {stop.name}
                      </p>
                      {stop.category && (
                        <p className="text-xs text-gray-500">{stop.category}</p>
                      )}
                      {stop.duration && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {stop.duration} min
                        </p>
                      )}
                    </div>
                    {index === currentStopIndex && (
                      <Navigation className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Resumen */}
              {route && (
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Total paradas</span>
                    <span className="font-medium">{route.stops.length}</span>
                  </div>
                  {route.estimated_duration && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">Duración est.</span>
                      <span className="font-medium">{Math.round(route.estimated_duration / 60)} hrs</span>
                    </div>
                  )}
                  {route.total_distance && (
                    <div className="flex items-center justify-between text-sm mt-2">
                      <span className="text-gray-500">Distancia</span>
                      <span className="font-medium">{route.total_distance.toFixed(1)} km</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Estilos para animación */}
        <style jsx global>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
}
