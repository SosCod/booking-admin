import { HotelDashboard } from '@/components/admin/hotel-dashboard';
import { AdminGuard } from '@/src/components/admin/AdminGuard';

export default function RootPage() {
  return (
    <AdminGuard>
      <HotelDashboard />
    </AdminGuard>
  );
}
