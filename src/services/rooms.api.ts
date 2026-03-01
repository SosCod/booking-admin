const API_URL = 'http://localhost:4000/api/rooms';

export async function getAllRooms() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener las habitaciones');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
}

export async function getRoomById(id: string | number) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Error al obtener la habitación');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching room ${id}:`, error);
    throw error;
  }
}

export async function createRoom(roomData: any) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) {
      throw new Error('Error al crear la habitación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating room:', error);
    throw error;
  }
}

export async function deleteRoom(id: number) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Error al eliminar la habitación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting room:', error);
    throw error;
  }
}

export async function updateRoom(id: number, roomData: any) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roomData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar la habitación');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating room:', error);
    throw error;
  }
}
