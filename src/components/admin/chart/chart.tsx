'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/src/components/admin/ui/card';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import {
  getDashboardStats,
  DashboardStats,
} from '@/src/services/dashboard.api';
import { AnimatedCounter } from '../animated-counter';

// Fallback data if backend is empty
const defaultData = [
  { name: 'Ene', earnings: 0 },
  { name: 'Feb', earnings: 0 },
  { name: 'Mar', earnings: 0 },
  { name: 'Abr', earnings: 0 },
  { name: 'May', earnings: 0 },
  { name: 'Jun', earnings: 0 },
  { name: 'Jul', earnings: 0 },
  { name: 'Ago', earnings: 0 },
  { name: 'Sep', earnings: 0 },
  { name: 'Oct', earnings: 0 },
  { name: 'Nov', earnings: 0 },
  { name: 'Dic', earnings: 0 },
];

export function EarningsChart() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  useEffect(() => {
    // Set the initial time only on the client to avoid hydration mismatch
    setCurrentTime(new Date());
    // Reloj en tiempo real
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load stats for chart', error);
      }
    }
    loadStats();

    const handleRefresh = () => loadStats();
    window.addEventListener('dashboardStatsNeedRefresh', handleRefresh);
    return () =>
      window.removeEventListener('dashboardStatsNeedRefresh', handleRefresh);
  }, []);

  const chartData = stats?.revenueData || defaultData;
  const totalRevenue = stats?.totalRevenue || 0;

  // Formatear la fecha (solo cuando currentTime está disponible en el cliente)
  const formattedDate = currentTime
    ? new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(currentTime)
    : '';

  const formattedTime = currentTime
    ? new Intl.DateTimeFormat('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }).format(currentTime)
    : '';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Rendimiento de Ganancias
          </h1>
          <div className="text-sm text-gray-400 mt-1 capitalize">
            {formattedDate} - {formattedTime}
          </div>
        </div>
      </div>

      <Card className="bg-gradient-to-br from-[#1a1f2e] to-[#2a2f3e] border-gray-700/50 shadow-sm text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium text-gray-200">
            Ganancias Mensuales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="colorEarnings"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    color: '#fff',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#f97316', fontWeight: 'bold' }}
                  formatter={(value: number) => [`$${value}`, 'Ganancias']}
                />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  stroke="#f97316"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorEarnings)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EarningsChart;
