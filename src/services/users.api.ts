// src/services/users.api.ts

const API_URL = 'http://localhost:4000/api/users';

export interface User {
  id: number;
  clerkId: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export async function getAllUsers(token?: string): Promise<User[]> {
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
      throw new Error(errorData.error || 'Error al obtener usuarios');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    throw error;
  }
}

export async function getUserById(id: number, token?: string): Promise<User> {
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
        errorData.error || `Error al obtener usuario con ID ${id}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getUserById:', error);
    throw error;
  }
}

export async function updateUser(
  id: number,
  data: Partial<User>,
  token?: string,
): Promise<User> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al actualizar usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updateUser:', error);
    throw error;
  }
}

export async function deleteUser(id: number, token?: string): Promise<void> {
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
      throw new Error(errorData.error || 'Error al eliminar usuario');
    }
  } catch (error) {
    console.error('Error en deleteUser:', error);
    throw error;
  }
}
