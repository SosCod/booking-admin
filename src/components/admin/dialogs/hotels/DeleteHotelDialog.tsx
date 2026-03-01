// @/src/components/dashboard/dialogs/hotels/DeleteHotelDialog.tsx
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/src/components/admin/ui/dialog';
import { Button } from '@/src/components/admin/ui/button';
import { deleteHotel } from '@/src/services/hotels.api';

export const DeleteHotelDialog = ({
  open,
  onOpenChange,
  hotelId,
  hotelName,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotelId: number | null;
  hotelName: string;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (!hotelId) return;
    try {
      setLoading(true);
      await deleteHotel(hotelId);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting hotel:', error);
      alert('Error al eliminar el hotel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Hotel</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que quieres eliminar el hotel{' '}
            <strong>{hotelName}</strong>? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
