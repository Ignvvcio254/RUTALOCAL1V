'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Heart, Star, Calendar, Route } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsGridProps {
  totalVisits: number;
  totalFavorites: number;
  totalReviews: number;
  totalRoutes?: number;
  memberSince: string;
}

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  delay: number;
}

function StatCard({ label, value, icon, color, delay }: StatCardProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 1000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>{icon}</div>
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-bold text-gray-900">{count.toLocaleString()}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </motion.div>
  );
}

export function StatsGrid({ totalVisits, totalFavorites, totalReviews, totalRoutes = 0, memberSince }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <StatCard
        label="Visitas"
        value={totalVisits}
        icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        color="bg-blue-100"
        delay={0}
      />
      <StatCard
        label="Favoritos"
        value={totalFavorites}
        icon={<Heart className="w-6 h-6 text-red-600" />}
        color="bg-red-100"
        delay={0.1}
      />
      <StatCard
        label="Reseñas"
        value={totalReviews}
        icon={<Star className="w-6 h-6 text-yellow-600" />}
        color="bg-yellow-100"
        delay={0.2}
      />
      <StatCard
        label="Rutas"
        value={totalRoutes}
        icon={<Route className="w-6 h-6 text-indigo-600" />}
        color="bg-indigo-100"
        delay={0.25}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20 shadow-sm col-span-2 md:col-span-1"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 rounded-xl bg-primary/20">
            <Calendar className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold text-gray-900">Miembro desde</div>
          <div className="text-sm text-gray-600">{memberSince}</div>
        </div>
      </motion.div>
    </div>
  );
}
