// src/admin/hotel-dashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, Bed, TrendingUp, ChevronUp, Eye } from 'lucide-react';

import { Card, CardContent } from '@/src/components/admin/ui/card';

import { AnimatedCounter } from './animated-counter';

import { Sidebar } from './sidebar/Sidebar';
import { DashboardProvider } from '@/src/components/context/DashboardContext'; // Only DashboardProvider needed here
import { DashboardContent } from '@/src/components/admin/dashboard-content'; // ✅ Import your new component
import {
  getDashboardStats,
  DashboardStats,
} from '@/src/services/dashboard.api';
import { HeaderAdmin } from '@/src/components/admin/header/Header';

export function HotelDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    newUsers: 0,
    totalRooms: 0,
    totalVisitors: 0,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats', error);
      }
    }
    loadStats();

    // Listen to custom event to refresh stats when bookings change
    const handleRefresh = () => loadStats();
    window.addEventListener('dashboardStatsNeedRefresh', handleRefresh);
    return () =>
      window.removeEventListener('dashboardStatsNeedRefresh', handleRefresh);
  }, []);

  return (
    <DashboardProvider>
      <div className="flex h-screen bg-[#0f1419] text-white overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <HeaderAdmin />

          <div className="p-6 space-y-6">
            {/* Stats Cards - These are static elements of your dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl text-white font-bold">
                        $<AnimatedCounter end={stats.totalRevenue} />
                      </div>
                      <div className="text-sm text-gray-400 mb-1">
                        Ganancias
                      </div>
                      <div className="flex items-center gap-1">
                        <ChevronUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-medium">
                          +2.4%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl text-white font-bold">
                        <AnimatedCounter end={stats.newUsers} />
                      </div>
                      <div className="text-sm text-gray-400">New Usuarios</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Bed className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl text-white font-bold">
                        <AnimatedCounter end={stats.totalRooms} />
                      </div>
                      <div className="text-sm text-gray-400">Rooms</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 hover:shadow-xl transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Eye className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-3xl text-white font-bold">
                        <AnimatedCounter end={stats.totalVisitors} />
                      </div>
                      <div className="text-sm text-gray-400">Visitantes</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Render the DashboardContent component here */}
            <DashboardContent /> {/* ✅ Call your new component */}
          </div>
        </div>

        <style jsx global>{`
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </DashboardProvider>
  );
}
