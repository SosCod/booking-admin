// src/services/bookings.api.ts
import { Booking } from '@/src/types/booking';

const API_URL = 'http://localhost:4000/api/bookings';

export async function getAllBookings(token?: string): Promise<Booking[]> {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al obtener reservas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllBookings:', error);
    throw error;
  }
}

export async function getRoomOccupancy(
  roomId: number,
): Promise<{ checkIn: string; checkOut: string }[]> {
  try {
    const response = await fetch(`${API_URL}/occupancy/${roomId}`);
    if (!response.ok) {
      throw new Error('Error al obtener ocupación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getRoomOccupancy:', error);
    return [];
  }
}

export async function getBookingById(
  id: number,
  token?: string,
): Promise<Booking> {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Error al obtener reserva con ID ${id}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en getBookingById para ID ${id}:`, error);
    throw error;
  }
}

export async function updateBookingStatus(
  id: number,
  status: string,
  token?: string,
): Promise<Booking> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}/status`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar estado');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateBookingStatus:', error);
    throw error;
  }
}

export async function deleteBooking(id: number, token?: string): Promise<void> {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al eliminar reserva');
    }
  } catch (error) {
    console.error('Error en deleteBooking:', error);
    throw error;
  }
}

export async function createBooking(
  bookingData: {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    specialRequests?: string;
  },
  token?: string,
): Promise<Booking> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || errorData.error || 'Error al crear la reserva',
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createBooking:', error);
    throw error;
  }
}
