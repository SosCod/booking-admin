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
import { deleteRoom } from '@/src/services/rooms.api';

export const DeleteRoomDialog = ({
  open,
  onOpenChange,
  roomIds,
  roomNames,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  roomIds: number[];
  roomNames: string;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    if (roomIds.length === 0) return;
    try {
      setLoading(true);
      for (const id of roomIds) {
        await deleteRoom(id);
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting room(s):', error);
      alert('Error al eliminar las habitaciones');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Eliminar Habitación</DialogTitle>
          <DialogDescription>
            {roomIds.length === 1 ? (
              <>
                ¿Estás seguro de que quieres eliminar la habitación{' '}
                <strong>{roomNames}</strong>? Esta acción no se puede deshacer.
              </>
            ) : (
              <>
                ¿Estás seguro de que quieres eliminar{' '}
                <strong>{roomIds.length} habitaciones</strong> ({roomNames})?
                Esta acción no se puede deshacer.
              </>
            )}
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
