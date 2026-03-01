// src/components/dashboard/sidebar/SidebarItem.tsx

'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/src/components/admin/ui/dropdown-menu';
import { Button } from '@/src/components/admin/ui/button';

import { CreateHotelDialog } from '@/src/components/admin/dialogs/hotels/CreateHotelDialog';
import { UpdateHotelDialog } from '@/src/components/admin/dialogs/hotels/UpdateHotelDialog';
import { DeleteHotelDialog } from '@/src/components/admin/dialogs/hotels/DeleteHotelDialog';
import { useDashboard } from '@/src/components/context/DashboardContext';

// ✅ La lista de elementos de la barra lateral

// Define tu tipo de dato para el elemento del sidebar si aún no lo tienes
type SidebarItemProps = {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  actions?: boolean;
  title: string;
};

export const SidebarItem = ({ item }: { item: SidebarItemProps }) => {
  const { setActiveContent } = useDashboard(); // ✅ Obtiene la función para cambiar el contenido
  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const [isUpdateOpen, setUpdateOpen] = React.useState(false);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const buttonClasses = `w-full justify-start gap-3 h-12 transition-all duration-200`;
  const conditionalClasses = item.active
    ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg hover:from-orange-700 hover:to-red-600'
    : 'text-gray-300 hover:text-slate-800 hover:bg-gray-700/50';

  // Función para manejar el clic en el elemento del sidebar
  const handleItemClick = () => {
    // ✅ Pasa el label y el title al contexto
    setActiveContent(
      item.label as Parameters<typeof setActiveContent>[0],
      item.title,
    );
  };

  if (!item.actions) {
    return (
      <Button
        variant="ghost"
        className={`w-full justify-start gap-3 h-12 transition-all duration-200 ${
          item.active
            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
            : 'text-gray-300 hover:text-white hover:bg-orange-500'
        }`}
        onClick={handleItemClick} // ✅ Añade el manejador de clic
      >
        <item.icon className="w-5 h-5" />
        {item.label}
      </Button>
    );
  }

  return (
    <React.Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`w-full justify-between items-center h-12 transition-all duration-200 ${
              item.active
                ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg'
                : 'text-gray-300 hover:text-slate-800 hover:bg-orange-500  '
            }`}
            onClick={handleItemClick} // ✅ Añade el manejador de clic
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5" />
              {item.label}
            </div>
          </Button>
        </DropdownMenuTrigger>
      </DropdownMenu>

      {/* Condiciona el renderizado de los diálogos */}
      {item.label === 'Hotels' && (
        <React.Fragment>
          <CreateHotelDialog
            open={isCreateOpen}
            onOpenChange={setCreateOpen}
            onSuccess={() => console.log('Hotel creado desde sidebar')}
          />
          <UpdateHotelDialog
            open={isUpdateOpen}
            onOpenChange={setUpdateOpen}
            hotel={undefined}
            onSuccess={() => console.log('Hotel actualizado desde sidebar')}
          />
          <DeleteHotelDialog
            open={isDeleteOpen}
            onOpenChange={setDeleteOpen}
            hotelId={null}
            hotelName=""
            onSuccess={() => console.log('Hotel eliminado desde sidebar')}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
