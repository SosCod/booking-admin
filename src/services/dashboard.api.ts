const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/dashboard`;

export interface DashboardStats {
  totalRevenue: number;
  newUsers: number;
  totalRooms: number;
  totalVisitors: number;
  revenueData?: { name: string; earnings: number }[];
}

export async function getDashboardStats(
  token?: string,
): Promise<DashboardStats> {
  try {
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/stats`, {
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || 'Error al obtener estadísticas del dashboard',
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getDashboardStats:', error);
    throw error;
  }
}
