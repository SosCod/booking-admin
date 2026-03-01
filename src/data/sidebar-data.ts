// src/data/sidebar-data.ts
// src/data/sidebar-data.ts

import { Home, BookOpen, Hotel, UserCheck, Bed, Settings } from 'lucide-react';

export const sidebarItems = [
  { icon: Home, label: 'Dashboard', title: 'Panel de Control', actions: false }, // ✅ Añadido title
  {
    icon: BookOpen,
    label: 'Bookings',
    title: 'Lista de Reservas',
    actions: true,
  }, // ✅ Añadido title
  { icon: Hotel, label: 'Hotels', title: 'Lista de Hoteles', actions: true }, // ✅ Añadido title
  {
    icon: Bed,
    label: 'Rooms',
    title: 'Gestión de Habitaciones',
    actions: true,
  }, // ✅ Añadido title
  {
    icon: UserCheck,
    label: 'User',
    title: 'Gestión de Usuarios',
    actions: true,
  }, // ✅ Añadido title
  { icon: Settings, label: 'Settings', title: 'Configuración', actions: true }, // ✅ Añadido title
];

// Opcional: Define el tipo para tus sidebarItems para mejor tipado
export type SidebarItemType = {
  icon: React.ElementType;
  label: string;
  title: string; // La nueva propiedad
  active?: boolean; // Si la usas en el futuro para determinar el item activo del sidebar
  actions: boolean;
};
