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
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
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

import { Booking } from '@/src/types/booking';

import {
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
} from '@/src/services/bookings.api';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'sonner';

export function DataTableBookings() {
  const { getToken } = useAuth();
  const [data, setData] = React.useState<Booking[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const fetchBookings = React.useCallback(async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const bookings = await getAllBookings(token || undefined);
      setData(bookings);
    } catch (error) {
      toast.error('Error al cargar reservas');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  React.useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      const token = await getToken();
      await updateBookingStatus(id, status, token || undefined);
      toast.success(`Reserva actualizada a ${status}`);
      fetchBookings();
      window.dispatchEvent(new Event('dashboardStatsNeedRefresh'));
    } catch (error) {
      toast.error('Error al actualizar el estado');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) return;
    try {
      const token = await getToken();
      await deleteBooking(id, token || undefined);
      toast.success('Reserva eliminada');
      fetchBookings();
      window.dispatchEvent(new Event('dashboardStatsNeedRefresh'));
    } catch (error) {
      toast.error('Error al eliminar la reserva');
    }
  };

  const handleGenerateInvoice = (booking: Booking) => {
    const checkIn = booking.checkIn ? new Date(booking.checkIn) : new Date();
    const checkOut = booking.checkOut ? new Date(booking.checkOut) : new Date();
    const nights = Math.max(
      1,
      Math.ceil(
        Math.abs(checkOut.getTime() - checkIn.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    );
    const totalPrice = booking.totalPrice || 0;
    const invoiceNo = `#REC-RES-${String(booking.id).padStart(5, '0')}`;
    const date = new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });

    const html = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Factura ${invoiceNo}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
          @media print {
            @page { size: auto; margin: 0; }
            body { margin: 0; padding: 0; }
            .no-print { display: none; }
          }
          .premium-shadow { box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15); }
        </style>
      </head>
      <body class="bg-gray-100 p-0 sm:p-10 flex justify-center items-start min-h-screen">
        <div class="w-full max-w-4xl bg-white premium-shadow border border-gray-100 overflow-hidden flex flex-col min-h-[1050px] print:shadow-none print:border-none print:m-0">
          <!-- Pink Ribbon -->
          <div class="h-3 bg-[#e11d48] w-full"></div>

          <div class="p-12 sm:p-20 flex-1 flex flex-col">
            <!-- Header -->
            <div class="flex justify-between items-start mb-20">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 bg-slate-900 flex items-center justify-center text-white font-black text-3xl">B</div>
                <div>
                  <h1 class="text-2xl font-black tracking-tighter leading-none">HOTEL<span class="text-[#e11d48]">BOOKING</span></h1>
                  <p class="text-[9px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-2">Premium Accommodations</p>
                </div>
              </div>
              <div class="text-right">
                <h2 class="text-6xl font-black text-slate-50 italic leading-none mb-3 select-none">INVOICE</h2>
                <p class="text-[#e11d48] font-black text-2xl tracking-tighter">${invoiceNo}</p>
              </div>
            </div>

            <!-- Info Bar -->
            <div class="grid grid-cols-2 gap-10 py-10 border-y border-gray-100 mb-16">
              <div>
                <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Invoice To:</p>
                <h3 class="text-2xl font-black text-slate-900 uppercase leading-none mb-2">${booking.user?.name || 'Cliente'}</h3>
                <p class="text-slate-500 font-medium tracking-tight text-lg">${booking.user?.email || 'email@example.com'}</p>
              </div>
              <div class="text-right">
                <div class="inline-block text-right">
                  <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-4 italic">Issued Date:</p>
                  <p class="text-xl font-bold text-slate-800">${date}</p>
                  <p class="text-[10px] text-white bg-[#e11d48] px-3 py-1 font-black uppercase tracking-widest mt-4 inline-block">ID: #${booking.id}</p>
                </div>
              </div>
            </div>

            <!-- Total Due Area -->
            <div class="mb-20">
              <p class="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3 italic">Total Amount Due</p>
              <div class="text-7xl font-black text-slate-900 italic tracking-tighter leading-none flex items-baseline">
                <span class="text-4xl mr-3 text-slate-300 not-italic">$</span>
                ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>

            <!-- Table -->
            <div class="mb-16">
              <div class="bg-[#e11d48] text-white flex px-8 py-5">
                <div class="flex-[3] text-[10px] font-black uppercase tracking-[0.2em]">Description</div>
                <div class="flex-1 text-center text-[10px] font-black uppercase tracking-[0.2em]">Price/Night</div>
                <div class="flex-1 text-center text-[10px] font-black uppercase tracking-[0.2em]">Nights</div>
                <div class="flex-1 text-right text-[10px] font-black uppercase tracking-[0.2em]">Total</div>
              </div>
              <div class="border-x border-b border-gray-50">
                <div class="flex px-8 py-12 items-center hover:bg-gray-50/50 transition-colors">
                  <div class="flex-[3]">
                    <h4 class="font-black text-slate-900 text-xl uppercase tracking-tight mb-2">${booking.room?.hotel?.name || 'Grand Hyatt Reserve'}</h4>
                    <p class="text-slate-400 text-xs font-bold uppercase tracking-[0.3em]">${booking.room?.name || 'Standard Luxury Room'}</p>
                    <div class="flex gap-8 mt-5">
                      <div>
                        <span class="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Check-in</span>
                        <span class="text-[11px] font-black text-slate-500 bg-gray-100 px-3 py-1.5">${checkIn.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span class="block text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Check-out</span>
                        <span class="text-[11px] font-black text-slate-500 bg-gray-100 px-3 py-1.5">${checkOut.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex-1 text-center font-black text-slate-600 text-xl tracking-tighter italic">$${(totalPrice / nights).toFixed(2)}</div>
                  <div class="flex-1 text-center font-black text-slate-600 text-xl tracking-tighter italic">${nights}</div>
                  <div class="flex-1 text-right font-black text-slate-900 text-2xl tracking-tighter italic">$${totalPrice.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <!-- Footer Section -->
            <div class="mt-auto pt-20 flex justify-between items-end">
              <div class="max-w-[320px]">
                <h5 class="text-[10px] font-black text-[#e11d48] uppercase tracking-[0.4em] mb-5 italic underline underline-offset-8">Payment Info</h5>
                <p class="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter mb-8">
                  This is a system generated invoice and does not require a physical signature. Payments made are final and non-refundable according to hotel terms.
                </p>
                <div class="flex gap-3 mt-10 opacity-30">
                  <div class="px-3 py-1.5 border border-slate-300 text-[9px] font-black rounded tracking-widest">VISA</div>
                  <div class="px-3 py-1.5 border border-slate-300 text-[9px] font-black rounded tracking-widest">AMEX</div>
                  <div class="px-3 py-1.5 border border-slate-300 text-[9px] font-black rounded tracking-widest">STRIPE</div>
                </div>
              </div>

              <div class="min-w-[320px] space-y-4">
                <div class="flex justify-between items-center text-sm px-4">
                  <span class="font-bold text-slate-300 uppercase tracking-[0.2em] italic">Sub Total</span>
                  <span class="font-black text-slate-800 text-lg tracking-tighter">$${totalPrice.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center text-sm px-4 border-b border-gray-50 pb-4">
                  <span class="font-bold text-slate-300 uppercase tracking-[0.2em] italic">Tax (0%)</span>
                  <span class="font-black text-slate-800 text-lg tracking-tighter">$0.00</span>
                </div>
                <div class="flex justify-between items-center bg-slate-900 text-white p-8 rounded-sm shadow-xl relative overflow-hidden group mb-10">
                  <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rotate-45 translate-x-12 -translate-y-12"></div>
                  <span class="font-black uppercase tracking-tighter italic text-2xl italic">Grand Total</span>
                  <span class="text-4xl font-black italic tracking-tighter">$${totalPrice.toFixed(2)}</span>
                </div>

                <div class="pt-28 text-center px-4">
                  <div class="h-[2px] w-full bg-gray-100 mb-4"></div>
                  <p class="text-3xl font-serif italic text-gray-400 mb-2 select-none opacity-50">SosCode</p>
                  <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em]">Accounts Manager</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Final Footer -->
          <div class="bg-gray-50 p-14 border-t border-gray-100 flex justify-between items-end">
            <div class="space-y-2">
              <p class="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">HOSPITALITY GROUP NETWORK</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic opacity-75 leading-none">Cuzco Historical Center, Av. Principal 123</p>
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic opacity-75 leading-none">contact@hotelbooking.com | +51 987 654 321</p>
            </div>
            <div class="flex items-center gap-3 opacity-20 hover:opacity-100 transition-opacity">
              <div class="w-10 h-10 bg-slate-900 flex items-center justify-center text-white font-black text-lg">B</div>
              <p class="text-base font-black tracking-tighter italic">HOTELBOOKING</p>
            </div>
          </div>
        </div>

        <!-- Floating Controls (No-Print) -->
        <div class="fixed bottom-10 right-10 flex gap-4 no-print">
          <button onclick="window.print()" class="bg-[#e11d48] text-white px-8 py-3 font-black text-sm tracking-widest shadow-2xl hover:bg-[#be123c] transition-all active:scale-95 uppercase">
            Imprimir Factura
          </button>
          <button onclick="window.close()" class="bg-slate-900 text-white px-8 py-3 font-black text-sm tracking-widest shadow-2xl hover:bg-black transition-all active:scale-95 uppercase">
            Cerrar
          </button>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      // Sugerir impresión después de un pequeño delay para que Tailwind cargue
      setTimeout(() => {
        // printWindow.print(); // Opcional: auto-llamar print
      }, 500);
    } else {
      toast.error(
        'La ventana emergente fue bloqueada. Por favor permite las ventanas emergentes.',
      );
    }
  };

  const columns: ColumnDef<Booking>[] = [
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
    },
    {
      id: 'user_name',
      accessorKey: 'user.name',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre Cliente
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const name =
          row.original.user?.name || row.original.user?.email || 'N/A';
        return <div className="font-semibold text-white">{name}</div>;
      },
    },
    {
      accessorKey: 'checkIn',
      header: 'Check-in',
      cell: ({ row }) => {
        const dateValue = row.getValue('checkIn');
        const date = dateValue ? new Date(dateValue as any) : null;
        if (!date || isNaN(date.getTime()))
          return <div className="text-left ">N/A</div>;
        return (
          <div className="text-left text-white">
            {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(
              date,
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'checkOut',
      header: 'Check-out',
      cell: ({ row }) => {
        const dateValue = row.getValue('checkOut');
        const date = dateValue ? new Date(dateValue as any) : null;
        if (!date || isNaN(date.getTime()))
          return <div className="text-left">N/A</div>;
        return (
          <div className="text-left text-white">
            {new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(
              date,
            )}
          </div>
        );
      },
    },
    {
      accessorKey: 'totalPrice',
      header: () => <div className="text-right">Precio Total</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('totalPrice'));
        const formatted = new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: 'USD',
        }).format(amount);
        return (
          <div className="text-right font-medium text-white">{formatted}</div>
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => {
        const status = row.getValue('status') as string;
        const colorMap: Record<string, string> = {
          PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
          CANCELLED: 'bg-red-100 text-red-800 border-red-200',
          COMPLETED: 'bg-blue-100 text-blue-800 border-blue-200',
        };
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-semibold border inline-block ${colorMap[status] || 'bg-gray-100'}`}
          >
            {status}
          </div>
        );
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const booking = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(String(booking.id))
                }
              >
                Copiar ID de reserva
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-xs text-gray-400">
                Cambiar Estado
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(booking.id, 'CONFIRMED')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />{' '}
                Confirmar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(booking.id, 'PENDING')}
              >
                <Clock className="mr-2 h-4 w-4 text-yellow-500" /> Pendiente
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(booking.id, 'CANCELLED')}
              >
                <XCircle className="mr-2 h-4 w-4 text-red-500" /> Cancelar
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
              >
                <CheckCircle className="mr-2 h-4 w-4 text-blue-500" />{' '}
                Completada
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => handleGenerateInvoice(booking)}>
                <FileText className="mr-2 h-4 w-4" /> Generar Factura
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-700 focus:bg-red-50"
                onClick={() => handleDelete(booking.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Reserva
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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

  if (loading)
    return <div className="p-8 text-center">Cargando reservas...</div>;

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por nombre..."
          value={
            (table.getColumn('user_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('user_name')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
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
      <div className="rounded-md border border-slate-200 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-slate-50/50 transition-colors"
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
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
    </div>
  );
}
