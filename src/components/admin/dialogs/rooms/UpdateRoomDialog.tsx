import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/admin/ui/dialog';
import { RoomsForm } from './rooms-form';

export const UpdateRoomDialog = ({
  open,
  onOpenChange,
  onSuccess,
  room,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  room: any;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Habitación</DialogTitle>
          <DialogDescription>
            Actualiza los detalles de la habitación "{room?.name}".
          </DialogDescription>
        </DialogHeader>
        {room && (
          <RoomsForm
            initialData={room}
            onSuccess={() => {
              onSuccess();
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
