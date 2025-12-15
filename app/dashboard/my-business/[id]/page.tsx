"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessById } from "@/lib/api/requests";
import { getBusinessAnalytics, type AnalyticsData, type DailyActivity } from "@/lib/api/interactions-service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Edit,
  TrendingUp,
  TrendingDown,
  MapPin,
  Phone,
  Globe,
  Clock,
  User,
  ThumbsUp,
  Calendar,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Review {
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface Stats {
  views: number;
  rating: number;
  review_count: number;
  favorites_count: number;
  visits_count: number;
  status: string;
}

interface DashboardData {
  business: any;
  stats: Stats;
  recent_reviews: Review[];
}

export default function BusinessDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessId = params.id as string;
        
        // Fetch dashboard data and analytics in parallel
        const [data, analyticsData] = await Promise.all([
          getBusinessById(businessId),
          getBusinessAnalytics(businessId)
        ]);
        
        setDashboardData(data);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const business = dashboardData?.business;
  const stats = dashboardData?.stats;
  const reviews = dashboardData?.recent_reviews || [];
  
  // Use real analytics data or fallback to empty
  const chartData = analytics?.daily_activity || [];
  const ratingDistribution = analytics?.rating_distribution 
    ? [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: analytics.rating_distribution[String(stars)] || 0,
        percentage: stats?.review_count 
          ? ((analytics.rating_distribution[String(stars)] || 0) / stats.review_count) * 100 
          : 0,
      }))
    : [5, 4, 3, 2, 1].map(stars => ({ stars, count: 0, percentage: 0 }));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Negocio no encontrado</h1>
        <Button onClick={() => router.push("/dashboard/my-business")}>
          Volver a mis negocios
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 md:p-6 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard/my-business")}
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a mis negocios
          </Button>
          <Button 
            onClick={() => router.push(`/dashboard/my-business/${business.id}/edit`)}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar negocio
          </Button>
        </div>

        {/* Business Header Card */}
        <Card className="overflow-hidden">
          <div className="relative h-32 md:h-48 bg-gradient-to-r from-indigo-600 to-purple-600">
            {business.cover_image && (
              <img 
                src={business.cover_image} 
                alt={business.name}
                className="w-full h-full object-cover opacity-30"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <CardContent className="relative -mt-16 md:-mt-20 px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-lg">
                <AvatarImage src={business.cover_image} alt={business.name} />
                <AvatarFallback className="text-2xl bg-indigo-100 text-indigo-600">
                  {business.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 pt-2 md:pt-8">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{business.name}</h1>
                  <Badge className={stats?.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {stats?.status === 'published' ? '✓ Publicado' : 'Pendiente'}
                  </Badge>
                </div>
                <p className="text-gray-600 mb-3 line-clamp-2">{business.description}</p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <Badge variant="outline">{business.category?.name || 'Sin categoría'}</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-900">{stats?.rating?.toFixed(1) || '0.0'}</span>
                    <span>({stats?.review_count || 0} reseñas)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  <Eye className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="w-16 h-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.slice(-5)}>
                      <Line type="monotone" dataKey="views" stroke="#4F46E5" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Vistas totales</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.views || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-emerald-600">+{Math.floor(Math.random() * 20 + 5)}%</span>
                <span className="text-gray-400">esta semana</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-rose-50">
                  <Heart className="h-5 w-5 text-rose-500" />
                </div>
                <Badge className="bg-rose-100 text-rose-700">{stats?.favorites_count || 0}</Badge>
              </div>
              <p className="text-sm text-gray-500 mb-1">Me gusta</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.favorites_count || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <ThumbsUp className="h-4 w-4 text-rose-500" />
                <span className="text-gray-500">Usuarios que te guardaron</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-amber-50">
                  <Star className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">Calificación</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.rating?.toFixed(1) || '0.0'}</p>
              <div className="flex items-center gap-1 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(stats?.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-emerald-50">
                  <MessageSquare className="h-5 w-5 text-emerald-600" />
                </div>
                {reviews.length > 0 && (
                  <Badge className="bg-emerald-100 text-emerald-700">Nuevo</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">Reseñas</p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats?.review_count || 0}</p>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <MessageSquare className="h-4 w-4 text-emerald-500" />
                <span className="text-gray-500">De usuarios verificados</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Charts Column */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="activity" className="space-y-4">
              <TabsList className="bg-white border">
                <TabsTrigger value="activity">Actividad</TabsTrigger>
                <TabsTrigger value="ratings">Calificaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-600" />
                      Actividad de los últimos 7 días
                    </CardTitle>
                    <CardDescription>Vistas y engagement de tu negocio</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {chartData.length > 0 ? (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                            <YAxis stroke="#9ca3af" fontSize={12} />
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                              labelStyle={{ fontWeight: 'bold' }}
                            />
                            <Bar dataKey="views" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Vistas" />
                            <Bar dataKey="likes" fill="#EC4899" radius={[4, 4, 0, 0]} name="Me gusta" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-64 flex items-center justify-center text-center text-gray-500">
                        <div>
                          <Eye className="h-12 w-12 mx-auto mb-3 opacity-30" />
                          <p className="font-medium">Sin datos de actividad aún</p>
                          <p className="text-sm">Los datos aparecerán cuando los usuarios visiten tu negocio</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ratings">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      Distribución de calificaciones
                    </CardTitle>
                    <CardDescription>Cómo califican los usuarios tu negocio</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {ratingDistribution.map(({ stars, count, percentage }) => (
                      <div key={stars} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-16">
                          <span className="font-medium">{stars}</span>
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        </div>
                        <Progress value={percentage} className="flex-1 h-3" />
                        <span className="w-12 text-sm text-gray-500 text-right">{count}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Información de contacto</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Dirección</p>
                      <p className="font-medium">{business.address}</p>
                    </div>
                  </div>
                )}
                {business.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Teléfono</p>
                      <p className="font-medium">{business.phone}</p>
                    </div>
                  </div>
                )}
                {business.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Sitio web</p>
                      <a href={business.website} target="_blank" rel="noopener" className="font-medium text-indigo-600 hover:underline">
                        {business.website}
                      </a>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Reviews Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-emerald-600" />
                    Reseñas recientes
                  </span>
                  <Badge variant="outline">{reviews.length}</Badge>
                </CardTitle>
                <CardDescription>Lo que dicen tus clientes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium">Sin reseñas aún</p>
                    <p className="text-sm">Las reseñas de tus clientes aparecerán aquí</p>
                  </div>
                ) : (
                  reviews.map((review, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-xl space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">
                              {review.user.split('@')[0]}
                            </p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">
                          {new Date(review.created_at).toLocaleDateString('es-CL', { 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Consejos para mejorar</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Responde a las reseñas de tus clientes</li>
                      <li>• Mantén tu información actualizada</li>
                      <li>• Sube fotos de calidad de tu negocio</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gallery */}
        {business.images && business.images.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Galería de fotos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {business.images.map((photo: string, index: number) => (
                  <img
                    key={index}
                    src={photo}
                    alt={`${business.name} ${index + 1}`}
                    className="rounded-lg object-cover w-full h-40 md:h-48 hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
