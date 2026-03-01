// src/components/dashboard/tables/hotels/DataTableHotels.tsx
'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  PencilLine,
  Plus,
  Trash2,
} from 'lucide-react';

import { Button } from '@/src/components/admin/ui/button';
import { Checkbox } from '@/src/components/admin/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/admin/ui/dropdown-menu';
import { Input } from '@/src/components/admin/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/src/components/admin/ui/table';

// ✅ Importa tus diálogos específicos de Hotel
import { CreateHotelDialog } from '@/src/components/admin/dialogs/hotels/CreateHotelDialog';
import { UpdateHotelDialog } from '@/src/components/admin/dialogs/hotels/UpdateHotelDialog';
import { DeleteHotelDialog } from '@/src/components/admin/dialogs/hotels/DeleteHotelDialog';
import { getAllHotels } from '@/src/services/hotels.api';

// ✅ Tu tipo de datos para Hotel, basado en tu modelo Prisma
export type Hotel = {
  id: number;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  images: string[];
  amenities: string[];
  rating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
};

// ✅ Columnas de la tabla para Hoteles
export const columns: ColumnDef<Hotel>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'city',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Ciudad
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'country',
    header: 'País',
  },
  {
    accessorKey: 'rating',
    header: () => <div className="text-right">Rating</div>,
    cell: ({ row }) => {
      const rating = row.getValue('rating') as number;
      return <div className="text-right">{rating.toFixed(1)} / 5</div>;
    },
  },
  {
    accessorKey: 'totalReviews',
    header: 'Reseñas',
    cell: ({ row }) => (
      <div className="text-right">{row.getValue('totalReviews')}</div>
    ),
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    cell: ({ row }) => {
      const dateValue = row.getValue('createdAt');
      const date = dateValue
        ? new Date(dateValue as string | number | Date)
        : null;

      if (!date || isNaN(date.getTime())) {
        return <div className="text-left text-muted-foreground">N/A</div>;
      }

      const formatted = new Intl.DateTimeFormat('es-ES', {
        dateStyle: 'short',
      }).format(date);
      return <div className="text-left">{formatted}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const hotel = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(String(hotel.id))}
            >
              Copiar ID de Hotel
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                row.toggleSelected(true);
                alert('Selecciona la fila y usa el botón superior para editar');
              }}
            >
              <PencilLine className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={() => {
                row.toggleSelected(true);
                alert(
                  'Selecciona la fila y usa el botón superior para eliminar',
                );
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function DataTableHotels() {
  const [data, setData] = React.useState<Hotel[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchHotels = React.useCallback(async () => {
    try {
      setLoading(true);
      const hotels = await getAllHotels();
      setData(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Estados para los diálogos de los botones superiores
  const [isCreateOpen, setCreateOpen] = React.useState(false);
  const [isUpdateOpen, setUpdateOpen] = React.useState(false);
  const [isDeleteOpen, setDeleteOpen] = React.useState(false);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full ">
      <div className="flex items-center justify-center py-4">
        <Input
          placeholder="Filtrar por nombre o ciudad..."
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="ml-auto flex items-center gap-2">
          <Button
            className="hover:bg-green-500"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            CREAR
          </Button>
          <Button
            className="hover:bg-yellow-400"
            onClick={() => setUpdateOpen(true)}
            disabled={table.getFilteredSelectedRowModel().rows.length !== 1}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            ACTUALIZAR
          </Button>
          <Button
            className="hover:bg-red-600"
            onClick={() => setDeleteOpen(true)}
            disabled={table.getFilteredSelectedRowModel().rows.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            ELIMINAR
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columnas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md items-center border">
        {loading ? (
          <div className="h-24 flex items-center justify-center">
            Cargando hoteles...
          </div>
        ) : (
          <Table className="text-white">
            <TableHeader className="text-white">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="items-center text-center text-white"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="text-white">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className="items-center text-center text-white"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="text-white items-center text-center">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No se encontraron resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{' '}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>

      <CreateHotelDialog
        open={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSuccess={() => fetchHotels()}
      />
      <UpdateHotelDialog
        open={isUpdateOpen}
        onOpenChange={setUpdateOpen}
        hotel={table.getFilteredSelectedRowModel().rows[0]?.original}
        onSuccess={() => fetchHotels()}
      />
      <DeleteHotelDialog
        open={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        hotelId={
          table.getFilteredSelectedRowModel().rows[0]?.original?.id || null
        }
        hotelName={
          table.getFilteredSelectedRowModel().rows[0]?.original?.name || ''
        }
        onSuccess={() => fetchHotels()}
      />
    </div>
  );
}
