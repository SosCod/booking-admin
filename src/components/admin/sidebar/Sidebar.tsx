// src/components/dashboard/sidebar/Sidebar.tsx
'use client';

import { useUser, useClerk } from '@clerk/nextjs';
import { LogOut } from 'lucide-react';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/src/components/admin/ui/avatar';
import { SidebarItem } from './SidebarItem';
import { sidebarItems } from '@/src/data/sidebar-data';

export function Sidebar() {
  const { user } = useUser();
  const { signOut } = useClerk();

  const initials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : (user?.firstName?.[0] ?? 'A');

  return (
    <div className="w-64 bg-[#1a1f2e] p-6 flex flex-col text-white">
      <div className="flex items-center gap-3 mb-8 p-3 rounded-lg bg-gray-800/50">
        <Avatar className="w-12 h-12 ring-2 ring-orange-500/20">
          <AvatarImage src={user?.imageUrl} />
          <AvatarFallback className="bg-orange-500">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">
            {user?.fullName ?? 'Admin'}
          </div>
          <div className="text-sm text-gray-400">Admin</div>
        </div>
        <button
          onClick={() => signOut({ redirectUrl: '/sign-in' })}
          className="p-2 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors"
          title="Cerrar sesión"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <nav className="space-y-1 flex-1">
        {sidebarItems.map((item, index) => (
          <SidebarItem key={index} item={item} />
        ))}
      </nav>

      <div className="mt-auto pt-8 text-xs text-gray-500">
        <div>© 2024 All Rights Reserved</div>
        <div>Made with by Sos.Code</div>
      </div>
    </div>
  );
}
