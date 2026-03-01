// src/components/admin/dashboard-content.tsx
'use client';

import { useDashboard } from '@/src/components/context/DashboardContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/admin/ui/card';
import { Button } from '@/src/components/admin/ui/button';
import { DataTableHotels } from '@/src/components/admin/hotels/DataTableHotels';
import { DataTableBookings } from '@/src/components/admin/bookin/DataTableBookings';
import { DataTableRooms } from '@/src/components/admin/rooms/DataTableRooms';

// Add other table components as you create them
import { DataTableUsers } from '@/src/components/admin/users/DataTableUsers';
import EarningsChart from './chart/chart';

export function DashboardContent() {
  const { activeContent, activeTitle } = useDashboard();

  // You can optionally show or hide the "View All" button based on the active content
  const showViewAllButton = activeContent !== 'Dashboard';

  return (
    <div className="flex-1 p-6">
      <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 text-black">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-xl text-white">
            {activeTitle}{' '}
            {/* This will display "Panel de Control", "Lista de Reservas", etc. */}
            {showViewAllButton && (
              <Button
                variant="ghost"
                size="sm"
                className="text-orange-500 hover:text-orange-400 border border-zinc-50"
              >
                View All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Conditional rendering based on activeContent */}
          {activeContent === 'Dashboard' && <EarningsChart />}
          {activeContent === 'Bookings' && <DataTableBookings />}
          {activeContent === 'Hotels' && <DataTableHotels />}
          {activeContent === 'Rooms' && <DataTableRooms />}
          {activeContent === 'User' && <DataTableUsers />}
          {activeContent === 'Settings' && (
            <div className="text-gray-400 h-96 flex items-center justify-center">
              <p className="text-lg">Contenido de **Configuración**.</p>
            </div>
          )}
          {/* Add more conditions for other content types */}
        </CardContent>
      </Card>
    </div>
  );
}
