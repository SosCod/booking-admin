// src/services/hotels.api.ts

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/hotels`;

export async function getAllHotels(filters?: {
  location?: string;
  guests?: number;
  minRating?: number;
  amenities?: string[];
}) {
  try {
    const queryParams = new URLSearchParams();
    if (filters?.location) queryParams.append('location', filters.location);
    if (filters?.guests)
      queryParams.append('guests', filters.guests.toString());
    if (filters?.minRating)
      queryParams.append('minRating', filters.minRating.toString());
    if (filters?.amenities) {
      filters.amenities.forEach((amenity) =>
        queryParams.append('amenities', amenity),
      );
    }

    const url = queryParams.toString()
      ? `${API_URL}?${queryParams.toString()}`
      : API_URL;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al obtener hoteles');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllHotels:', error);
    throw error;
  }
}

export async function getHotelById(id: string | number) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener el hotel');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getHotelById:', error);
    throw error;
  }
}

export async function createHotels(data: Record<string, unknown>) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear hotel');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createHotels:', error);
    throw error;
  }
}

export async function updateHotel(id: number, data: Record<string, unknown>) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar hotel');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateHotel:', error);
    throw error;
  }
}

export async function deleteHotel(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar hotel');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deleteHotel:', error);
    throw error;
  }
}
