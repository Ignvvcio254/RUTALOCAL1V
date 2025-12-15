/**
 * Configuración de Filtros para Home
 * Inspirado en Uber Eats, adaptado para Hospedaje, Gastronomía y Turismo
 */

// Tipos de categorías principales
export type MainCategoryId = 'all' | 'hospedaje' | 'gastronomia' | 'turismo';

// Interfaz para categoría principal
export interface MainCategory {
  id: MainCategoryId;
  label: string;
  icon: string;
  description: string;
  color: string;
}

// Interfaz para filtro de experiencia
export interface ExperienceFilter {
  id: string;
  label: string;
  icon: string;
  category: MainCategoryId;
}

// Interfaz para filtro de atributo
export interface AttributeFilter {
  id: string;
  label: string;
  icon: string;
  description: string;
}

// Categorías Principales
export const MAIN_CATEGORIES: Record<MainCategoryId, MainCategory> = {
  all: {
    id: 'all',
    label: 'Todos',
    icon: '🌐',
    description: 'Explorar todo',
    color: '#6B7280', // gray-500
  },
  hospedaje: {
    id: 'hospedaje',
    label: 'Hospedaje',
    icon: '🏠',
    description: 'Lugares para descansar',
    color: '#3B82F6', // blue-500
  },
  gastronomia: {
    id: 'gastronomia',
    label: 'Gastronomía',
    icon: '🍽️',
    description: 'Comida y bebida',
    color: '#F59E0B', // amber-500
  },
  turismo: {
    id: 'turismo',
    label: 'Turismo',
    icon: '🎒',
    description: 'Experiencias y actividades',
    color: '#10B981', // green-500
  },
} as const;

// Filtros de Experiencia por Categoría
export const EXPERIENCE_FILTERS: Record<MainCategoryId, ExperienceFilter[]> = {
  all: [
    { id: 'destacados', label: 'Destacados', icon: '⭐', category: 'all' },
    { id: 'nuevos', label: 'Nuevos', icon: '🆕', category: 'all' },
    { id: 'populares', label: 'Populares', icon: '🔥', category: 'all' },
    { id: 'verificados', label: 'Verificados', icon: '✓', category: 'all' },
  ],
  hospedaje: [
    { id: 'boutique', label: 'Boutique/Lujo', icon: '✨', category: 'hospedaje' },
    { id: 'economico', label: 'Hostal/Económico', icon: '💰', category: 'hospedaje' },
    { id: 'familiar', label: 'Familiar/Cabañas', icon: '👨‍👩‍👧', category: 'hospedaje' },
    { id: 'pet-friendly', label: 'Pet Friendly', icon: '🐾', category: 'hospedaje' },
    { id: 'wifi', label: 'WiFi Gratis', icon: '📶', category: 'hospedaje' },
    { id: 'piscina', label: 'Con Piscina', icon: '🏊', category: 'hospedaje' },
  ],
  gastronomia: [
    { id: 'tradicional', label: 'Cocina Tradicional', icon: '🇨🇱', category: 'gastronomia' },
    { id: 'vegano', label: 'Vegano/Saludable', icon: '🥗', category: 'gastronomia' },
    { id: 'cafeterias', label: 'Cafeterías/Brunch', icon: '☕', category: 'gastronomia' },
    { id: 'street-food', label: 'Street Food', icon: '🌮', category: 'gastronomia' },
    { id: 'internacional', label: 'Internacional', icon: '🌍', category: 'gastronomia' },
    { id: 'mariscos', label: 'Mariscos', icon: '🦞', category: 'gastronomia' },
  ],
  turismo: [
    { id: 'historia', label: 'Historia y Cultura', icon: '🏛️', category: 'turismo' },
    { id: 'naturaleza', label: 'Naturaleza/Outdoors', icon: '🌲', category: 'turismo' },
    { id: 'aventura', label: 'Aventura/Deporte', icon: '⛰️', category: 'turismo' },
    { id: 'miradores', label: 'Miradores/Paisajes', icon: '🌅', category: 'turismo' },
    { id: 'tours-guiados', label: 'Tours Guiados', icon: '👨‍🏫', category: 'turismo' },
    { id: 'museos', label: 'Museos/Galerías', icon: '🎨', category: 'turismo' },
  ],
} as const;

// Filtros de Atributos (aplicables a todas las categorías)
export const ATTRIBUTE_FILTERS: AttributeFilter[] = [
  {
    id: 'accessible',
    label: 'Accesible',
    icon: '♿',
    description: 'Accesibilidad universal',
  },
  {
    id: 'top-rated',
    label: '4.0+ ⭐',
    icon: '⭐',
    description: 'Calificación 4.0 o superior',
  },
  {
    id: 'open-now',
    label: 'Abierto Ahora',
    icon: '🟢',
    description: 'Actualmente operativo',
  },
  {
    id: 'offers',
    label: 'Ofertas',
    icon: '🎁',
    description: 'Tiene promociones activas',
  },
  {
    id: 'quick',
    label: 'Menos 30min',
    icon: '⚡',
    description: 'Menos de 30 minutos de distancia',
  },
  {
    id: 'verified',
    label: 'Verificado',
    icon: '✓',
    description: 'Verificado por RutaGo',
  },
] as const;

// Helper para obtener filtros de experiencia por categoría
export function getExperienceFilters(categoryId: MainCategoryId): ExperienceFilter[] {
  return EXPERIENCE_FILTERS[categoryId] || EXPERIENCE_FILTERS.all;
}

// Helper para obtener color de categoría
export function getCategoryColor(categoryId: MainCategoryId): string {
  return MAIN_CATEGORIES[categoryId]?.color || MAIN_CATEGORIES.all.color;
}

// Helper para obtener categoría por ID
export function getCategory(categoryId: MainCategoryId): MainCategory {
  return MAIN_CATEGORIES[categoryId] || MAIN_CATEGORIES.all;
}

// Exportar arrays para iteración
export const mainCategoriesArray = Object.values(MAIN_CATEGORIES);
export const attributeFiltersArray = ATTRIBUTE_FILTERS;
