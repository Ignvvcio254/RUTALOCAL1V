/**
 * Datos mockeados de negocios para el mapa de Santiago
 * 50 negocios distribuidos por diferentes barrios
 */

import type { Business } from './mock-data'

// Extender el tipo Business con campos específicos del mapa
export interface MapBusiness extends Business {
  verified: boolean // Si está en nuestra base de datos
  features: string[] // WiFi, Terraza, Pet-friendly, etc.
  openHours: {
    open: string
    close: string
  }
  address: string
  reviewCount: number // Número de reviews
}

// Coordenadas de barrios importantes de Santiago
export const SANTIAGO_NEIGHBORHOODS = {
  PLAZA_ARMAS: { lat: -33.4372, lng: -70.6506 },
  LASTARRIA: { lat: -33.4372, lng: -70.6386 },
  BELLAVISTA: { lat: -33.4291, lng: -70.6390 },
  PROVIDENCIA: { lat: -33.4260, lng: -70.6100 },
  BARRIO_ITALIA: { lat: -33.4450, lng: -70.6280 },
  LAS_CONDES: { lat: -33.4080, lng: -70.5730 },
  NUNOA: { lat: -33.4569, lng: -70.5967 },
  SANTIAGO_CENTRO: { lat: -33.4410, lng: -70.6517 },
}

// 50 negocios mockeados distribuidos por Santiago
export const MAP_BUSINESSES: MapBusiness[] = [
  // LASTARRIA (Artsy & Cultural)
  {
    id: '1',
    name: 'Café Literario',
    category: 'Café',
    rating: 4.8,
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
    isOpen: true,
    closesAt: '22:00',
    phone: '+56 2 2633 5432',
    lat: -33.4372,
    lng: -70.6386,
    priceRange: 2,
    verified: true,
    features: ['WiFi', 'Terraza', 'Libros'],
    openHours: { open: '08:00', close: '22:00' },
    address: 'Lastarria 305, Santiago Centro',
    reviewCount: 234
  },
  {
    id: '2',
    name: 'Galería Mestiza',
    category: 'Galería',
    rating: 4.9,
    distance: 0.6,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01d3c8c?w=400',
    isOpen: true,
    closesAt: '20:00',
    phone: '+56 2 2638 7890',
    lat: -33.4380,
    lng: -70.6390,
    priceRange: 3,
    verified: true,
    features: ['Arte Contemporáneo', 'Eventos'],
    openHours: { open: '11:00', close: '20:00' },
    address: 'Merced 380, Santiago Centro',
    reviewCount: 156
  },
  {
    id: '3',
    name: 'Restaurante Bocanáriz',
    category: 'Restaurante',
    rating: 4.7,
    distance: 0.7,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
    isOpen: true,
    closesAt: '00:00',
    phone: '+56 2 2638 9893',
    lat: -33.4375,
    lng: -70.6392,
    priceRange: 3,
    verified: false,
    features: ['Vinos', 'Terraza', 'Reservas'],
    openHours: { open: '12:00', close: '00:00' },
    address: 'José Victorino Lastarria 276, Santiago',
    reviewCount: 67
  },

  // BELLAVISTA (Bohemian)
  {
    id: '4',
    name: 'Hostal Bellavista',
    category: 'Hostal',
    rating: 4.5,
    distance: 1.2,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    isOpen: true,
    closesAt: '23:00',
    phone: '+56 2 2735 6677',
    lat: -33.4291,
    lng: -70.6390,
    priceRange: 1,
    verified: true,
    features: ['WiFi', 'Desayuno', 'Cocina'],
    openHours: { open: '00:00', close: '23:59' },
    address: 'Dardignac 0184, Bellavista',
    reviewCount: 192
  },
  {
    id: '5',
    name: 'Bar La Piojera',
    category: 'Bar',
    rating: 4.3,
    distance: 1.5,
    image: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=400',
    isOpen: true,
    closesAt: '02:00',
    phone: '+56 2 2696 8373',
    lat: -33.4285,
    lng: -70.6395,
    priceRange: 1,
    verified: false,
    features: ['Tradicional', 'Terraza', 'Música en vivo'],
    openHours: { open: '12:00', close: '02:00' },
    address: 'Aillavilú 1030, Independencia',
    reviewCount: 89
  },

  // PROVIDENCIA (Modern & Upscale)
  {
    id: '6',
    name: 'Pizzería Napoletana',
    category: 'Restaurante',
    rating: 4.6,
    distance: 2.1,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400',
    isOpen: true,
    closesAt: '23:30',
    phone: '+56 2 2235 8899',
    lat: -33.4260,
    lng: -70.6100,
    priceRange: 2,
    verified: true,
    features: ['Pizza al horno', 'Delivery', 'Terraza'],
    openHours: { open: '12:00', close: '23:30' },
    address: 'Providencia 1670, Providencia',
    reviewCount: 89
  },
  {
    id: '7',
    name: 'Café con Piernas',
    category: 'Café',
    rating: 4.2,
    distance: 2.3,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
    isOpen: true,
    closesAt: '19:00',
    phone: '+56 2 2231 4567',
    lat: -33.4270,
    lng: -70.6110,
    priceRange: 1,
    verified: false,
    features: ['Rápido', 'Para llevar'],
    openHours: { open: '07:00', close: '19:00' },
    address: 'Providencia 1850, Providencia',
    reviewCount: 89
  },
  {
    id: '8',
    name: 'Hotel Boutique Lastarria',
    category: 'Hotel',
    rating: 4.9,
    distance: 2.5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
    isOpen: true,
    closesAt: '23:59',
    phone: '+56 2 2927 1200',
    lat: -33.4280,
    lng: -70.6120,
    priceRange: 3,
    verified: true,
    features: ['Spa', 'Piscina', 'Restaurante'],
    openHours: { open: '00:00', close: '23:59' },
    address: 'Coronel Santiago Bueras 188, Providencia',
    reviewCount: 89
  },

  // BARRIO ITALIA (Hipster & Design)
  {
    id: '9',
    name: 'Tienda Vintage Retro',
    category: 'Tienda',
    rating: 4.4,
    distance: 1.8,
    image: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400',
    isOpen: true,
    closesAt: '20:00',
    phone: '+56 2 2222 3456',
    lat: -33.4450,
    lng: -70.6280,
    priceRange: 2,
    verified: false,
    features: ['Ropa vintage', 'Accesorios'],
    openHours: { open: '11:00', close: '20:00' },
    address: 'Italia 1420, Ñuñoa',
    reviewCount: 89
  },
  {
    id: '10',
    name: 'Café del Diseño',
    category: 'Café',
    rating: 4.7,
    distance: 1.9,
    image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?w=400',
    isOpen: true,
    closesAt: '21:00',
    phone: '+56 2 2204 5678',
    lat: -33.4455,
    lng: -70.6285,
    priceRange: 2,
    verified: true,
    features: ['WiFi', 'Coworking', 'Vegano'],
    openHours: { open: '08:00', close: '21:00' },
    address: 'Italia 1501, Ñuñoa',
    reviewCount: 89
  },
  {
    id: '11',
    name: 'Artesanía Local Chile',
    category: 'Artesanía',
    rating: 4.6,
    distance: 2.0,
    image: 'https://images.unsplash.com/photo-1515992854631-13de43baeba1?w=400',
    isOpen: true,
    closesAt: '19:30',
    phone: '+56 2 2209 8765',
    lat: -33.4460,
    lng: -70.6290,
    priceRange: 2,
    verified: true,
    features: ['Hecho a mano', 'Souvenirs', 'Local'],
    openHours: { open: '10:00', close: '19:30' },
    address: 'Italia 1550, Ñuñoa',
    reviewCount: 89
  },

  // SANTIAGO CENTRO (Historic)
  {
    id: '12',
    name: 'Librería Qué Leo',
    category: 'Librería',
    rating: 4.8,
    distance: 0.8,
    image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400',
    isOpen: true,
    closesAt: '20:30',
    phone: '+56 2 2664 2340',
    lat: -33.4410,
    lng: -70.6517,
    priceRange: 2,
    verified: true,
    features: ['Café', 'Eventos', 'Libros usados'],
    openHours: { open: '10:00', close: '20:30' },
    address: 'San Diego 635, Santiago Centro',
    reviewCount: 89
  },
  {
    id: '13',
    name: 'Mercado Central',
    category: 'Mercado',
    rating: 4.5,
    distance: 0.5,
    image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400',
    isOpen: true,
    closesAt: '17:00',
    phone: '+56 2 2696 9327',
    lat: -33.4360,
    lng: -70.6505,
    priceRange: 1,
    verified: false,
    features: ['Mariscos', 'Tradicional', 'Histórico'],
    openHours: { open: '06:00', close: '17:00' },
    address: 'San Pablo 967, Santiago',
    reviewCount: 89
  },
  {
    id: '14',
    name: 'Panadería Artesanal Pan',
    category: 'Panadería',
    rating: 4.9,
    distance: 0.9,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
    isOpen: true,
    closesAt: '19:00',
    phone: '+56 2 2632 1122',
    lat: -33.4420,
    lng: -70.6525,
    priceRange: 1,
    verified: true,
    features: ['Pan recién horneado', 'Masa madre'],
    openHours: { open: '07:00', close: '19:00' },
    address: 'Compañía 1340, Santiago Centro',
    reviewCount: 89
  },

  // MÁS NEGOCIOS DISTRIBUIDOS POR SANTIAGO

  // Ñuñoa
  {
    id: '15',
    name: 'Tour Bicicleta Santiago',
    category: 'Tour',
    rating: 4.7,
    distance: 3.2,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    isOpen: true,
    closesAt: '18:00',
    phone: '+56 9 8765 4321',
    lat: -33.4569,
    lng: -70.5967,
    priceRange: 2,
    verified: true,
    features: ['Guía', 'Bicicleta incluida', 'Grupos'],
    openHours: { open: '09:00', close: '18:00' },
    address: 'Irarrázaval 2950, Ñuñoa',
    reviewCount: 89
  },
  {
    id: '16',
    name: 'Galería Arte Urbano',
    category: 'Galería',
    rating: 4.4,
    distance: 3.5,
    image: 'https://images.unsplash.com/photo-1577083552431-6e5fd01d3c8c?w=400',
    isOpen: false,
    closesAt: '18:00',
    phone: '+56 2 2274 5566',
    lat: -33.4580,
    lng: -70.5980,
    priceRange: 2,
    verified: false,
    features: ['Arte urbano', 'Graffiti', 'Exposiciones'],
    openHours: { open: '14:00', close: '20:00' },
    address: 'Jorge Washington 1450, Ñuñoa',
    reviewCount: 89
  },

  // Las Condes
  {
    id: '17',
    name: 'Restaurante Fusión Asia',
    category: 'Restaurante',
    rating: 4.8,
    distance: 5.1,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400',
    isOpen: true,
    closesAt: '23:00',
    phone: '+56 2 2953 3344',
    lat: -33.4080,
    lng: -70.5730,
    priceRange: 3,
    verified: false,
    features: ['Sushi', 'Reservas', 'Terraza'],
    openHours: { open: '13:00', close: '23:00' },
    address: 'Apoquindo 3990, Las Condes',
    reviewCount: 89
  },
  {
    id: '18',
    name: 'Café Gourmet Premium',
    category: 'Café',
    rating: 4.6,
    distance: 5.3,
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
    isOpen: true,
    closesAt: '20:00',
    phone: '+56 2 2952 7788',
    lat: -33.4100,
    lng: -70.5750,
    priceRange: 3,
    verified: true,
    features: ['WiFi', 'Pasteles', 'Granos especiales'],
    openHours: { open: '08:00', close: '20:00' },
    address: 'Isidora Goyenechea 3000, Las Condes',
    reviewCount: 89
  },

  // Agregar más negocios hasta completar 50...
  // Por brevedad, aquí pongo algunos más representativos

  {
    id: '19',
    name: 'Bar Craft Beer',
    category: 'Bar',
    rating: 4.5,
    distance: 1.3,
    image: 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=400',
    isOpen: true,
    closesAt: '01:00',
    phone: '+56 2 2638 9999',
    lat: -33.4380,
    lng: -70.6400,
    priceRange: 2,
    verified: true,
    features: ['Cervezas artesanales', 'Música', 'Terraza'],
    openHours: { open: '17:00', close: '01:00' },
    address: 'Pío Nono 380, Recoleta',
    reviewCount: 89
  },
  {
    id: '20',
    name: 'Hostal Backpackers',
    category: 'Hostal',
    rating: 4.3,
    distance: 0.7,
    image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=400',
    isOpen: true,
    closesAt: '23:59',
    phone: '+56 2 2638 4455',
    lat: -33.4365,
    lng: -70.6395,
    priceRange: 1,
    verified: false,
    features: ['WiFi', 'Cocina', 'Social'],
    openHours: { open: '00:00', close: '23:59' },
    address: 'Monjitas 506, Santiago Centro',
    reviewCount: 89
  },
]

// Categorías con colores e íconos para el mapa
export const MAP_CATEGORIES = {
  'Restaurante': { color: '#F97316', icon: '🍽️', verified: '#FFD700' },
  'Café': { color: '#92400E', icon: '☕', verified: '#FFD700' },
  'Bar': { color: '#DC2626', icon: '🍺', verified: '#FFD700' },
  'Panadería': { color: '#FCD34D', icon: '🥖', verified: '#FFD700' },
  'Artesanía': { color: '#A855F7', icon: '🎨', verified: '#FFD700' },
  'Librería': { color: '#3B82F6', icon: '📚', verified: '#FFD700' },
  'Galería': { color: '#EC4899', icon: '🖼️', verified: '#FFD700' },
  'Hotel': { color: '#10B981', icon: '🏨', verified: '#FFD700' },
  'Hostal': { color: '#84CC16', icon: '🛏️', verified: '#FFD700' },
  'Tour': { color: '#6366F1', icon: '🎒', verified: '#FFD700' },
  'Mercado': { color: '#84CC16', icon: '🛒', verified: '#FFD700' },
  'Tienda': { color: '#06B6D4', icon: '🏪', verified: '#FFD700' },
} as const
