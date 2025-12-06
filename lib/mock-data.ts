export interface Business {
  id: string
  name: string
  category: string
  rating: number
  distance: number
  image: string
  isOpen: boolean
  closesAt: string
  phone: string
  lat: number
  lng: number
  priceRange: number
}

export const MOCK_BUSINESSES: Business[] = [
  {
    id: "1",
    name: "Café Histórico",
    category: "café",
    rating: 4.8,
    distance: 0.3,
    image: "/vintage-coffee-shop.jpg",
    isOpen: true,
    closesAt: "20:00",
    phone: "+56 2 2345 6789",
    lat: -33.8688,
    lng: -51.2093,
    priceRange: 1,
  },
  {
    id: "2",
    name: "Galería de Arte Local",
    category: "arte",
    rating: 4.6,
    distance: 0.5,
    image: "/art-gallery-exhibition.jpg",
    isOpen: true,
    closesAt: "18:00",
    phone: "+56 2 9876 5432",
    lat: -33.87,
    lng: -51.205,
    priceRange: 2,
  },
  {
    id: "3",
    name: "Tours Santiago Auténtico",
    category: "tour",
    rating: 4.9,
    distance: 0.8,
    image: "/city-tour-guide.jpg",
    isOpen: true,
    closesAt: "21:00",
    phone: "+56 2 5555 5555",
    lat: -33.865,
    lng: -51.215,
    priceRange: 2,
  },
  {
    id: "4",
    name: "Hostal Viajeros",
    category: "hostal",
    rating: 4.7,
    distance: 1.2,
    image: "/cozy-hostel-rooms.jpg",
    isOpen: true,
    closesAt: "23:00",
    phone: "+56 2 7777 7777",
    lat: -33.875,
    lng: -51.21,
    priceRange: 1,
  },
  {
    id: "5",
    name: "Espresso Boutique",
    category: "café",
    rating: 4.5,
    distance: 1.5,
    image: "/modern-coffee-bar.jpg",
    isOpen: false,
    closesAt: "18:30",
    phone: "+56 2 3333 3333",
    lat: -33.86,
    lng: -51.2,
    priceRange: 2,
  },
  {
    id: "6",
    name: "Taller de Cerámica",
    category: "arte",
    rating: 4.4,
    distance: 2.1,
    image: "/pottery-ceramic-studio.jpg",
    isOpen: true,
    closesAt: "19:00",
    phone: "+56 2 4444 4444",
    lat: -33.855,
    lng: -51.225,
    priceRange: 3,
  },
]
