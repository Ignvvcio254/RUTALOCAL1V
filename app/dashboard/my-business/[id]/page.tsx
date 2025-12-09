"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getBusinessById, getBusinessStats } from "@/lib/api/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Edit,
  BarChart3,
  Users,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Globe,
  Clock,
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  description: string;
  business_count: number;
}

interface Business {
  id: string;
  name: string;
  description: string;
  category: Category;
  rating: string;
  images: string[];
  cover_image: string;
  address: string;
  phone?: string;
  website?: string;
  hours?: any;
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
  business: Business;
  stats: Stats;
  recent_reviews: any[];
}

export default function BusinessDashboard() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const businessId = params.id as string;
        const data = await getBusinessById(businessId);
        setDashboardData(data);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Negocio no encontrado</h1>
        <Button onClick={() => router.push("/dashboard/my-business")}>
          Volver a mis negocios
        </Button>
      </div>
    );
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/my-business")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a mis negocios
        </Button>
        <Button onClick={() => router.push(`/dashboard/my-business/${business.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar negocio
        </Button>
      </div>

      {/* Business Info Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={business.cover_image} alt={business.name} />
              <AvatarFallback>{business.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold">{business.name}</h1>
                  <Badge className="mt-2">{business.category.name}</Badge>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-bold">{parseFloat(business.rating || "0").toFixed(1)}</span>
                </div>
              </div>
              <p className="text-muted-foreground mt-3">{business.description}</p>
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {business.address}
                </div>
                {business.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {business.phone}
                  </div>
                )}
                {business.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      Sitio web
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vistas Totales</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.views || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +20.1% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Me gusta</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.favorites_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +15.3% desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reseñas</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.review_count || 0}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +8 nuevas este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calificación</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.rating?.toFixed(1) || "0.0"}</div>
            <p className="text-xs text-muted-foreground">Promedio de {stats?.review_count || 0} reseñas</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="views" className="space-y-4">
        <TabsList>
          <TabsTrigger value="views">Vistas</TabsTrigger>
          <TabsTrigger value="ratings">Calificaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="views" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vistas de los últimos 7 días</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Los datos históricos estarán disponibles próximamente</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ratings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución de calificaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay reseñas todavía</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Gallery */}
      {business.images && business.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Galería de fotos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {business.images.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`${business.name} ${index + 1}`}
                  className="rounded-lg object-cover w-full h-48"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
