// @/src/components/dashboard/dialogs/hotels/CreateHotelDialog.tsx
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/admin/ui/dialog';
import { HotelsForm } from './hotels-form';

export const CreateHotelDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Hotel</DialogTitle>
          <DialogDescription>
            Ingresa los detalles para crear un nuevo hotel.
          </DialogDescription>
        </DialogHeader>
        <HotelsForm
          onSuccess={() => {
            onSuccess();
            onOpenChange(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
