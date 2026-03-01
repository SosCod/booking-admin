// @/src/components/dashboard/dialogs/hotels/UpdateHotelDialog.tsx
import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/components/admin/ui/dialog';
import { Hotel } from '../../hotels/DataTableHotels';
import { HotelsForm } from './hotels-form';

export const UpdateHotelDialog = ({
  open,
  onOpenChange,
  hotel,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hotel: Hotel | undefined;
  onSuccess: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Actualizar Hotel</DialogTitle>
          <DialogDescription>
            Edita la información de <strong>{hotel?.name}</strong>.
          </DialogDescription>
        </DialogHeader>

        {hotel && (
          <HotelsForm
            initialData={hotel}
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
