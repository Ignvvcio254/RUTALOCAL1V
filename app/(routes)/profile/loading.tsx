import { Loader2 } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header Skeleton */}
        <div className="bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-200 rounded w-64 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-56 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar Skeleton */}
          <aside className="hidden lg:block space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-20 bg-gray-200 rounded-xl animate-pulse"
              />
            ))}
          </aside>

          {/* Main Content Skeleton */}
          <main className="space-y-6">
            <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
            <div className="h-96 bg-gray-200 rounded-2xl animate-pulse" />
          </main>
        </div>
      </div>
    </div>
  );
}
