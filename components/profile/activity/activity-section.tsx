'use client';

import { useEffect, useState } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import { SectionCard } from '../shared';
import { StatsGrid } from './stats-grid';
import { ActivityTimeline } from './activity-timeline';
import { ActivityData, StatsData, activityService } from '@/lib/profile';

interface ActivitySectionProps {
  userId: string;
}

export function ActivitySection({ userId }: ActivitySectionProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [activities, setActivities] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activitiesData] = await Promise.all([
          activityService.getStats(userId),
          activityService.getActivities(userId, 50),
        ]);

        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error al cargar actividad:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-48 bg-gray-100 animate-pulse rounded-2xl" />
        <div className="h-96 bg-gray-100 animate-pulse rounded-2xl" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error al cargar la actividad</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <StatsGrid
        totalVisits={stats.totalVisits}
        totalFavorites={stats.totalFavorites}
        totalReviews={stats.totalReviews}
        totalRoutes={stats.totalRoutes || 0}
        memberSince={new Date(stats.memberSince).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
        })}
      />

      {/* Activity Timeline */}
      <SectionCard
        title="Actividad Reciente"
        description="Tu historial de interacciones"
        icon={<ActivityIcon className="w-5 h-5" />}
      >
        <ActivityTimeline activities={activities} />
      </SectionCard>
    </div>
  );
}
