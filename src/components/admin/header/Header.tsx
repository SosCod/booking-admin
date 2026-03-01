'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/src/components/admin/ui/button';
import { Bell, Calendar } from 'lucide-react';

export function HeaderAdmin() {
  const [hasNotification, setHasNotification] = useState(false);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());

    // Update the date periodically to ensure it changes if the app stays open past midnight
    const interval = setInterval(
      () => {
        setCurrentDate(new Date());
      },
      1000 * 60 * 60,
    ); // every hour

    // Listen for custom event for new reservations
    const handleNewReservation = () => {
      setHasNotification(true);
    };

    window.addEventListener('newReservation', handleNewReservation);

    return () => {
      clearInterval(interval);
      window.removeEventListener('newReservation', handleNewReservation);
    };
  }, []);

  const formatDate = (date: Date) => {
    // using es-ES to match language preference
    return new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <header className="flex items-center justify-between p-6 border-b border-gray-700/50 bg-[#1a1f2e]/50 backdrop-blur-sm transition-colors duration-200">
      <div>
        {/* The main dashboard title can remain here as it's part of the static header */}
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to Booking Admin Dashboard</p>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setHasNotification(false)}
          className="relative hover:bg-gray-700/50 text-white"
        >
          <Bell className="w-5 h-5" />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-gray-700/50 text-white cursor-default"
        >
          <Calendar className="w-5 h-5" />
        </Button>
        <div className="text-sm border-l border-gray-700 pl-4">
          <div className="text-orange-500 font-medium whitespace-nowrap capitalize">
            {currentDate ? formatDate(currentDate) : '...'}
          </div>
          <div className="text-gray-400 font-medium mt-0.5">ES</div>
        </div>
      </div>
    </header>
  );
}
