// src/components/context/DashboardContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define los tipos de contenido que puede mostrar tu dashboard
// Mantén los mismos valores que los 'label' de sidebar-data.ts
type ActiveContentType =
  | 'Dashboard'
  | 'Bookings'
  | 'Hotels'
  | 'User'
  | 'Rooms'
  | 'Settings';

interface DashboardContextType {
  activeContent: ActiveContentType;
  activeTitle: string; // ✅ NUEVO: Para guardar el título de la vista actual
  setActiveContent: (content: ActiveContentType, title: string) => void; // ✅ Modificado para recibir el título
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [activeContent, setActiveContentState] =
    useState<ActiveContentType>('Dashboard');
  const [activeTitle, setActiveTitleState] =
    useState<string>('Panel de Control'); // Título inicial

  const setActiveContent = (content: ActiveContentType, title: string) => {
    setActiveContentState(content);
    setActiveTitleState(title);
  };

  return (
    <DashboardContext.Provider
      value={{ activeContent, activeTitle, setActiveContent }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
