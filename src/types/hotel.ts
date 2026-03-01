// src/types/hotel.ts

export interface Hotel {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  images: FileList | string[];
  amenities?: string[];
  rating: number;
  totalReviews: number;
  createdAt: string; // O Date, dependiendo de cómo manejes las fechas en el frontend
  updatedAt: string; // O Date
}

export interface FormDataForBackend {
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  images: string[]; // <-- ¡Aquí siempre será un array de URLs (strings)!
  amenities?: string[]; // <-- ¡Aquí siempre será un array de strings!
  rating?: number; // Opcional, ya que tu backend le da un default si no lo envías
  totalReviews?: number; // Opcional, ya que tu backend le da un default si no lo envías
}
// Tipo para crear un nuevo hotel (omitiendo campos generados)
export type CreateHotelData = Omit<Hotel, 'id' | 'createdAt' | 'updatedAt' | 'rooms' | 'reviews' | 'rating' | 'totalReviews'>;
// También omitimos 'rating' y 'totalReviews' ya que tienen @default(0) en Prisma
// y serán gestionados por la lógica de tu backend después de que se envíen las reseñas.
